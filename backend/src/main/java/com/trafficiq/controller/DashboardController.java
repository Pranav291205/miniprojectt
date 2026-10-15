package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import com.trafficiq.dto.DashboardSummaryDto;
import com.trafficiq.service.TrafficService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TrafficService trafficService;

    public DashboardController(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryDto> getSummary() {
        return ApiResponse.ok(trafficService.getDashboardSummary());
    }
}
