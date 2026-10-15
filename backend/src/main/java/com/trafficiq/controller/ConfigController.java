package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Value("${trafficiq.maps.google-api-key:}")
    private String googleApiKey;

    @GetMapping("/maps")
    public ApiResponse<Map<String, Object>> getMapsConfig() {
        Map<String, Object> map = new LinkedHashMap<>();
        boolean isConfigured = googleApiKey != null && !googleApiKey.isBlank();
        map.put("googleMapsConfigured", isConfigured);
        map.put("apiKey", isConfigured ? googleApiKey : "");
        map.put("provider", isConfigured ? "Google Maps JavaScript API + Live Traffic Layer" : "CartoDB / OpenStreetMap");
        map.put("status", isConfigured ? "CONNECTED" : "FALLBACK_MODE");
        return ApiResponse.ok(map);
    }
}
