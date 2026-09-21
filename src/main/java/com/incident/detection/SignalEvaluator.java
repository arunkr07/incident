package com.incident.detection;

import org.springframework.stereotype.Component;

@Component
public class SignalEvaluator {

    public boolean evaluate(
            Double actual,
            DetectionOperator operator,
            Double threshold
    ) {

        return switch (operator) {

            case GREATER_THAN ->
                    actual > threshold;

            case GREATER_THAN_OR_EQUAL ->
                    actual >= threshold;

            case LESS_THAN ->
                    actual < threshold;

            case LESS_THAN_OR_EQUAL ->
                    actual <= threshold;
        };
    }
}