package com.incident.detection;

import com.incident.common.exception.ApiException;
import com.incident.detection.dto.*;

import com.incident.service.Service;
import com.incident.service.ServiceService;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;

import java.util.List;

@org.springframework.stereotype.Service
public class DetectionRuleService {

    private final DetectionRuleRepository repository;
    private final ServiceService serviceService;

    public DetectionRuleService(
            DetectionRuleRepository repository,
            ServiceService serviceService
    ) {
        this.repository = repository;
        this.serviceService = serviceService;
    }

    @Transactional
    public List<DetectionRuleResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(DetectionRuleResponse::from)
                .toList();
    }

    @Transactional
    public List<DetectionRuleResponse> getByService(
            Long serviceId
    ) {

        serviceService.findEntity(serviceId);

        return repository.findByServiceId(serviceId)
                .stream()
                .map(DetectionRuleResponse::from)
                .toList();
    }

    @Transactional
    public DetectionRuleResponse create(
            DetectionRuleRequest request
    ) {

        Service service =
                serviceService.findEntity(
                        request.serviceId()
                );

        DetectionRule rule = new DetectionRule();

        rule.setService(service);
        rule.setName(request.name());
        rule.setMetricType(request.metricType());
        rule.setOperator(request.operator());
        rule.setThreshold(request.threshold());
        rule.setSeverity(request.severity());

        rule.setEnabled(
                request.enabled() == null
                        ? true
                        : request.enabled()
        );

        rule.setEvaluationWindowSeconds(
                request.evaluationWindowSeconds() == null
                        ? 60
                        : request.evaluationWindowSeconds()
        );

        DetectionRule saved = repository.save(rule);

        DetectionRuleResponse response =
                DetectionRuleResponse.from(saved);

        return response;
    }

    @Transactional
    public DetectionRuleResponse update(
            Long id,
            DetectionRuleUpdateRequest request
    ) {

        DetectionRule rule = repository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.NOT_FOUND,
                                "Detection rule not found"
                        )
                );

        if (request.name() != null) {
            rule.setName(request.name());
        }

        if (request.metricType() != null) {
            rule.setMetricType(request.metricType());
        }

        if (request.operator() != null) {
            rule.setOperator(request.operator());
        }

        if (request.threshold() != null) {
            rule.setThreshold(request.threshold());
        }

        if (request.severity() != null) {
            rule.setSeverity(request.severity());
        }

        if (request.enabled() != null) {
            rule.setEnabled(request.enabled());
        }

        if (request.evaluationWindowSeconds() != null) {
            rule.setEvaluationWindowSeconds(
                    request.evaluationWindowSeconds()
            );
        }

        return DetectionRuleResponse.from(repository.save(rule));
    }
}