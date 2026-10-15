package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import com.trafficiq.entity.IncidentEntity;
import com.trafficiq.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ApiResponse<List<IncidentEntity>> getIncidents(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(incidentService.getAllIncidents(severity, category));
    }

    @PostMapping
    public ApiResponse<IncidentEntity> createIncident(@RequestBody IncidentEntity incident) {
        return ApiResponse.ok("Incident registered successfully", incidentService.createIncident(incident));
    }
}
