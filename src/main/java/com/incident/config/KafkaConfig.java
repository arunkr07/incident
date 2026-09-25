package com.incident.config;

import com.incident.incident.event.IncidentEvent;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;

import org.springframework.kafka.support.serializer.JacksonJsonDeserializer;
import org.springframework.kafka.support.serializer.JacksonJsonSerializer;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {

        java.util.Map<String, Object> config =
                new java.util.HashMap<>();

        config.put(
                org.apache.kafka.clients.producer.ProducerConfig
                        .BOOTSTRAP_SERVERS_CONFIG,
                bootstrapServers
        );

        config.put(
                org.apache.kafka.clients.producer.ProducerConfig
                        .KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class
        );

        config.put(
                org.apache.kafka.clients.producer.ProducerConfig
                        .VALUE_SERIALIZER_CLASS_CONFIG,
                JacksonJsonSerializer.class
        );

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(
            ProducerFactory<String, Object> producerFactory
    ) {
        return new KafkaTemplate<>(producerFactory);
    }

    @Bean
    public ConsumerFactory<String, IncidentEvent> incidentEventConsumerFactory() {

        JacksonJsonDeserializer<IncidentEvent> deserializer =
                new JacksonJsonDeserializer<>(IncidentEvent.class);

        deserializer.addTrustedPackages("com.incident");

        java.util.Map<String, Object> config =
                new java.util.HashMap<>();

        config.put(
                org.apache.kafka.clients.consumer.ConsumerConfig
                        .BOOTSTRAP_SERVERS_CONFIG,
                bootstrapServers
        );

        config.put(
                org.apache.kafka.clients.consumer.ConsumerConfig
                        .GROUP_ID_CONFIG,
                "incident-backend"
        );

        config.put(
                org.apache.kafka.clients.consumer.ConsumerConfig
                        .KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        config.put(
                org.apache.kafka.clients.consumer.ConsumerConfig
                        .VALUE_DESERIALIZER_CLASS_CONFIG,
                JacksonJsonDeserializer.class
        );

        config.put(
                org.apache.kafka.clients.consumer.ConsumerConfig
                        .AUTO_OFFSET_RESET_CONFIG,
                "earliest"
        );

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, IncidentEvent>
    incidentKafkaListenerContainerFactory(
            ConsumerFactory<String, IncidentEvent> consumerFactory
    ) {

        ConcurrentKafkaListenerContainerFactory<String, IncidentEvent>
                factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory);

        return factory;
    }

    @Bean
    public NewTopic incidentCreatedTopic() {
        return new NewTopic(
                "incident.created",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic incidentAcknowledgedTopic() {
        return new NewTopic(
                "incident.acknowledged",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic incidentInvestigatingTopic() {
        return new NewTopic(
                "incident.investigation.started",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic incidentResolvedTopic() {
        return new NewTopic(
                "incident.resolved",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic incidentReopenedTopic() {
        return new NewTopic(
                "incident.reopened",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic detectionTriggeredTopic() {
        return new NewTopic(
                "detection.triggered",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic deploymentCreatedTopic() {
        return new NewTopic(
                "deployment.created",
                3,
                (short) 1
        );
    }

    @Bean
    public NewTopic deploymentCompletedTopic() {
        return new NewTopic(
                "deployment.completed",
                3,
                (short) 1
        );
    }
}