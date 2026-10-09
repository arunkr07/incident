package com.incident.ai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfiguration {

    @Bean
    public OpenAIClient openAIClient() {

        return OpenAIOkHttpClient
                .builder()
                .fromEnv()
                .build();
    }
}