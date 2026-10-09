package com.incident.ai.remediation;

import com.incident.ai.remediation.dto.RemediationRequest;
import com.incident.ai.remediation.dto.RemediationResponse;
import com.incident.common.exception.ApiException;
import com.incident.incident.Incident;
import com.incident.incident.IncidentService;
import com.incident.service.Service;
import com.incident.service.ServiceService;
import org.springframework.http.HttpStatus;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class RemediationService {

    private final RemediationRepository remediationRepository;
    private final IncidentService incidentService;
    private final ServiceService serviceService;
    private final RemediationExecutor remediationExecutor;

    public RemediationService(
            RemediationRepository remediationRepository,
            IncidentService incidentService,
            ServiceService serviceService,
            RemediationExecutor remediationExecutor
    ) {
        this.remediationRepository = remediationRepository;
        this.incidentService = incidentService;
        this.serviceService = serviceService;
        this.remediationExecutor = remediationExecutor;
    }

    @Transactional
    public RemediationResponse create(
            Long incidentId,
            RemediationRequest request
    ) {

        Incident incident =
                incidentService.findEntity(
                        incidentId
                );

        Service service =
                serviceService.findEntity(
                        request.serviceId()
                );

        if (!service.getId().equals(
                incident.getService().getId()
        )) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Remediation service does not belong to incident"
            );
        }

        Remediation remediation =
                new Remediation();

        remediation.setIncident(incident);
        remediation.setService(service);
        remediation.setType(request.type());
        remediation.setStatus(
                RemediationStatus.PENDING_APPROVAL
        );
        remediation.setReason(request.reason());
        remediation.setRisk(request.risk());
        remediation.setParameters(
                request.parameters()
        );
        remediation.setCreatedAt(
                LocalDateTime.now()
        );

        return RemediationResponse.from(
                remediationRepository.save(
                        remediation
                )
        );
    }

    @Transactional
    public RemediationResponse approve(
            Long remediationId
    ) {

        Remediation remediation =
                get(remediationId);

        if (remediation.getStatus()
                != RemediationStatus.PENDING_APPROVAL) {

            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Remediation is not awaiting approval"
            );
        }

        remediation.setStatus(
                RemediationStatus.APPROVED
        );

        remediation.setApprovedAt(
                LocalDateTime.now()
        );

        return RemediationResponse.from(
                remediationRepository.save(
                        remediation
                )
        );
    }

    @Transactional
    public RemediationResponse reject(
            Long remediationId,
            String reason
    ) {

        Remediation remediation =
                get(remediationId);

        if (remediation.getStatus()
                != RemediationStatus.PENDING_APPROVAL) {

            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Remediation is not awaiting approval"
            );
        }

        remediation.setStatus(
                RemediationStatus.REJECTED
        );

        remediation.setFailureReason(
                reason
        );

        return RemediationResponse.from(
                remediationRepository.save(
                        remediation
                )
        );
    }

    @Transactional
    public RemediationResponse execute(
            Long remediationId
    ) {

        Remediation remediation =
                get(remediationId);

        if (remediation.getStatus()
                != RemediationStatus.APPROVED) {

            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Remediation must be approved before execution"
            );
        }

        remediation.setStatus(
                RemediationStatus.EXECUTING
        );

        remediation.setExecutedAt(
                LocalDateTime.now()
        );

        remediation =
                remediationRepository.save(
                        remediation
                );

        RemediationExecutionResult result =
                remediationExecutor.execute(
                        remediation
                );

        if (result.successful()) {

            remediation.setStatus(
                    RemediationStatus.COMPLETED
            );

            remediation.setExecutionMessage(
                    result.message()
            );

            remediation.setCompletedAt(
                    LocalDateTime.now()
            );

        } else {

            remediation.setStatus(
                    RemediationStatus.FAILED
            );

            remediation.setFailureReason(
                    result.failureReason()
            );

            remediation.setCompletedAt(
                    LocalDateTime.now()
            );
        }

        return RemediationResponse.from(
                remediationRepository.save(
                        remediation
                )
        );
    }

    @Transactional(readOnly = true)
    public List<RemediationResponse> getForIncident(
            Long incidentId
    ) {

        return remediationRepository
                .findByIncidentIdOrderByCreatedAtDesc(
                        incidentId
                )
                .stream()
                .map(RemediationResponse::from)
                .toList();
    }

    private Remediation get(
            Long id
    ) {

        return remediationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.NOT_FOUND,
                                "Remediation not found"
                        )
                );
    }
}