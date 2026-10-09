
package com.incident.ai.investigation;

import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.dependency.ServiceDependency;
import com.incident.dependency.ServiceDependencyRepository;
import com.incident.deployment.Deployment;
import com.incident.deployment.DeploymentRepository;
import com.incident.incident.Incident;
import com.incident.incident.IncidentRepository;
import com.incident.incident.IncidentTimeline;
import com.incident.incident.IncidentTimelineRepository;
import com.incident.log.Log;
import com.incident.log.LogRepository;
import com.incident.metric.Metric;
import com.incident.metric.MetricRepository;
import com.incident.service.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class RepositoryInvestigationContextProvider
        implements InvestigationContextProvider {

    private final IncidentTimelineRepository timelineRepository;
    private final LogRepository logRepository;
    private final MetricRepository metricRepository;
    private final DeploymentRepository deploymentRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final IncidentRepository incidentRepository;

    @Value("${ai.investigation.max-log-entries:100}")
    private int maxLogEntries;

    @Value("${ai.investigation.max-metric-entries:100}")
    private int maxMetricEntries;

    @Value("${ai.investigation.max-deployment-entries:20}")
    private int maxDeploymentEntries;

    @Value("${ai.investigation.max-previous-incidents:10}")
    private int maxPreviousIncidents;

    public RepositoryInvestigationContextProvider(
            IncidentTimelineRepository timelineRepository,
            LogRepository logRepository,
            MetricRepository metricRepository,
            DeploymentRepository deploymentRepository,
            ServiceDependencyRepository dependencyRepository,
            IncidentRepository incidentRepository
    ) {
        this.timelineRepository = timelineRepository;
        this.logRepository = logRepository;
        this.metricRepository = metricRepository;
        this.deploymentRepository = deploymentRepository;
        this.dependencyRepository = dependencyRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public InvestigationContext buildContext(Incident incident) {
        Service service = incident.getService();
        Long serviceId = service.getId();

        List<String> timeline =
                timelineRepository
                        .findByIncidentIdOrderByCreatedAtAsc(incident.getId())
                        .stream()
                        .map(this::formatTimeline)
                        .toList();

        List<String> logs =
                logRepository
                        .findByServiceIdOrderByTimestampDesc(serviceId)
                        .stream()
                        .limit(Math.max(0, maxLogEntries))
                        .map(this::formatLog)
                        .toList();

        LocalDateTime metricStart =
                incident.getStartedAt() == null
                        ? LocalDateTime.now().minusHours(24)
                        : incident.getStartedAt().minusHours(1);

        List<String> metrics =
                metricRepository
                        .findByServiceIdAndRecordedAtAfterOrderByRecordedAtDesc(
                                serviceId, metricStart)
                        .stream()
                        .limit(Math.max(0, maxMetricEntries))
                        .map(this::formatMetric)
                        .toList();

        List<String> deployments =
                deploymentRepository
                        .findByServiceIdOrderByStartedAtDesc(serviceId)
                        .stream()
                        .limit(Math.max(0, maxDeploymentEntries))
                        .map(this::formatDeployment)
                        .toList();

        List<String> dependencies = new ArrayList<>();

        dependencyRepository.findBySourceServiceId(serviceId)
                .forEach(dependency ->
                        dependencies.add(formatDependency(dependency, true)));

        dependencyRepository.findByTargetServiceId(serviceId)
                .forEach(dependency ->
                        dependencies.add(formatDependency(dependency, false)));

        List<String> previousIncidents =
                incidentRepository
                        .findByServiceIdOrderByStartedAtDesc(serviceId)
                        .stream()
                        .filter(previous ->
                                !previous.getId().equals(incident.getId()))
                        .limit(Math.max(0, maxPreviousIncidents))
                        .map(previous ->
                                "Incident ID=%s, title=%s, severity=%s, status=%s, startedAt=%s"
                                        .formatted(
                                                previous.getId(),
                                                safe(previous.getTitle()),
                                                previous.getSeverity(),
                                                previous.getStatus(),
                                                previous.getStartedAt()))
                        .toList();

        return new InvestigationContext(
                incident.getId(),
                incident.getTitle(),
                incident.getDescription(),
                incident.getSeverity().name(),
                incident.getStatus().name(),
                incident.getSource().name(),
                serviceId,
                service.getName(),
                timeline,
                metrics,
                logs,
                deployments,
                dependencies,
                previousIncidents
        );
    }

    private String formatTimeline(IncidentTimeline timeline) {
        return "%s | %s | %s".formatted(
                timeline.getCreatedAt(),
                timeline.getEventType(),
                timeline.getMessage());
    }

    private String formatLog(Log log) {
        return "%s | %s | %s".formatted(
                log.getTimestamp(),
                log.getLevel(),
                log.getMessage());
    }

    private String formatMetric(Metric metric) {
        return "%s | %s = %s".formatted(
                metric.getRecordedAt(),
                metric.getMetricType(),
                metric.getMetricValue());
    }

    private String formatDeployment(Deployment deployment) {
        return "%s | version=%s | status=%s | description=%s".formatted(
                deployment.getStartedAt(),
                deployment.getVersion(),
                deployment.getStatus(),
                safe(deployment.getDescription()));
    }

    private String formatDependency(
            ServiceDependency dependency,
            boolean outgoing
    ) {
        String direction = outgoing ? "depends on" : "is depended on by";

        Service otherService = outgoing
                ? dependency.getTargetService()
                : dependency.getSourceService();

        return "%s %s %s (type=%s)".formatted(
                dependency.getSourceService().getName(),
                direction,
                otherService.getName(),
                dependency.getDependencyType());
    }

    private String safe(String value) {
        return value == null ? "N/A" : value;
    }
}
