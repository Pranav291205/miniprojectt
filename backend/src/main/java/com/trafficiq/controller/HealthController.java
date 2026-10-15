package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import com.trafficiq.service.OnnxInferenceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final OnnxInferenceService inferenceService;

    public HealthController(OnnxInferenceService inferenceService) {
        this.inferenceService = inferenceService;
    }

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> getHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("application", "TrafficIQ Backend");
        health.put("version", "1.0.0");
        health.put("javaVersion", System.getProperty("java.version"));
        health.put("inferenceEngine", inferenceService.getInferenceEngine());
        health.put("modelLoaded", inferenceService.isModelLoaded());
        health.put("dataset", "PEMS-BAY Traffic Benchmark");
        health.put("weatherSource", "Open-Meteo Historical Weather");
        return ApiResponse.ok(health);
    }
}
