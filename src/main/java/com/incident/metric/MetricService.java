package com.incident.metric;

import com.incident.metric.dto.MetricRequest;
import com.incident.metric.dto.MetricResponse;
import com.incident.service.Service;
import com.incident.service.ServiceService;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class MetricService {

    private final MetricRepository repository;
    private final ServiceService serviceService;

    public MetricService(
            MetricRepository repository,
            ServiceService serviceService
    ) {
        this.repository = repository;
        this.serviceService = serviceService;
    }

    @Transactional
    public List<MetricResponse> getMetrics(
            Long serviceId,
            String metricType,
            LocalDateTime from,
            LocalDateTime to
    ) {

        List<Metric> metrics;

        if (serviceId != null
                && metricType != null
                && from != null
                && to != null) {

            metrics =
                    repository
                            .findByServiceIdAndMetricTypeAndRecordedAtBetweenOrderByRecordedAtAsc(
                                    serviceId,
                                    metricType,
                                    from,
                                    to
                            );

        } else if (serviceId != null && metricType != null) {

            metrics =
                    repository
                            .findByServiceIdAndMetricTypeOrderByRecordedAtDesc(
                                    serviceId,
                                    metricType
                            );

        } else if (serviceId != null) {

            metrics =
                    repository
                            .findByServiceIdAndRecordedAtAfterOrderByRecordedAtDesc(
                                    serviceId,
                                    from == null
                                            ? LocalDateTime.now().minusHours(1)
                                            : from
                            );

        } else {

            metrics = repository.findAll();
        }

        return metrics.stream()
                .map(MetricResponse::from)
                .toList();
    }

    @Transactional
    public MetricResponse create(MetricRequest request) {

        Service service =
                serviceService.findEntity(request.serviceId());

        Metric metric = new Metric();

        metric.setService(service);
        metric.setMetricType(request.metricType());
        metric.setMetricValue(request.metricValue());
        metric.setRecordedAt(
                request.recordedAt() == null
                        ? LocalDateTime.now()
                        : request.recordedAt()
        );

        return MetricResponse.from(repository.save(metric));
    }
}