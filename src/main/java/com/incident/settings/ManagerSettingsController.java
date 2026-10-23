package com.incident.settings;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class ManagerSettingsController {
    private final ManagerSettingsService service;

    public ManagerSettingsController(ManagerSettingsService service) {
        this.service = service;
    }

    @GetMapping
    public Map<String, Object> get(Authentication authentication) {
        return service.getForEmail(authentication.getName());
    }

    @PutMapping
    public Map<String, Object> save(Authentication authentication,
                                    @RequestBody Map<String, Object> updates) {
        return service.saveForEmail(authentication.getName(), updates);
    }
}
