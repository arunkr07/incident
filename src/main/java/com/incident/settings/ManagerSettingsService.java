package com.incident.settings;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.incident.auth.Manager;
import com.incident.auth.ManagerRepository;
import com.incident.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ManagerSettingsService {
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {};
    private final ManagerSettingsRepository settingsRepository;
    private final ManagerRepository managerRepository;
    private final ObjectMapper objectMapper;

    public ManagerSettingsService(ManagerSettingsRepository settingsRepository,
                                  ManagerRepository managerRepository,
                                  ObjectMapper objectMapper) {
        this.settingsRepository = settingsRepository;
        this.managerRepository = managerRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getForEmail(String email) {
        Manager manager = findManager(email);
        return settingsRepository.findByManagerId(manager.getId())
                .map(entity -> parse(entity.getSettingsJson()))
                .orElseGet(LinkedHashMap::new);
    }

    @Transactional
    public Map<String, Object> saveForEmail(String email, Map<String, Object> updates) {
        Manager manager = findManager(email);
        ManagerSettings entity = settingsRepository.findByManagerId(manager.getId())
                .orElseGet(ManagerSettings::new);
        Map<String, Object> merged = entity.getSettingsJson() == null
                ? new LinkedHashMap<>()
                : parse(entity.getSettingsJson());
        if (updates != null) merged.putAll(updates);
        try {
            entity.setManagerId(manager.getId());
            entity.setSettingsJson(objectMapper.writeValueAsString(merged));
            settingsRepository.save(entity);
            return merged;
        } catch (Exception exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save manager settings.");
        }
    }

    private Manager findManager(String email) {
        return managerRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated manager was not found."));
    }

    private Map<String, Object> parse(String json) {
        try {
            Map<String, Object> parsed = objectMapper.readValue(json, MAP_TYPE);
            return parsed == null ? new LinkedHashMap<>() : new LinkedHashMap<>(parsed);
        } catch (Exception exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Saved manager settings could not be read.");
        }
    }
}
