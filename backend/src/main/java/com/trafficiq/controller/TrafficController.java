package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import com.trafficiq.dto.ForecastRequest;
import com.trafficiq.dto.ForecastResponse;
import com.trafficiq.dto.LocationDto;
import com.trafficiq.service.TrafficService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/traffic", "/api"})
public class TrafficController {

    private final TrafficService trafficService;

    public TrafficController(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @GetMapping("/locations")
    public ApiResponse<List<LocationDto>> getLocations() {
        return ApiResponse.ok(trafficService.getAllLocations());
    }

    @GetMapping("/locations/{id}")
    public ResponseEntity<ApiResponse<LocationDto>> getLocationById(@PathVariable Long id) {
        return trafficService.getLocationById(id)
                .map(loc -> ResponseEntity.ok(ApiResponse.ok(loc)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/locations/{id}/history")
    public ResponseEntity<ApiResponse<List<ForecastResponse.RecentSpeedPoint>>> getLocationHistory(@PathVariable Long id) {
        return trafficService.getLocationById(id)
                .map(loc -> ResponseEntity.ok(ApiResponse.ok(trafficService.generateRecentHistory(loc.getCurrentSpeedMph()))))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/locations/{id}/forecast")
    public ResponseEntity<ApiResponse<ForecastResponse>> getForecast(
            @PathVariable Long id,
            @RequestParam(defaultValue = "15") Integer horizon) {
        return trafficService.getLocationById(id)
                .map(loc -> {
                    ForecastRequest req = new ForecastRequest();
                    req.setSensorId(id);
                    req.setHorizon(horizon);
                    req.setCurrentSpeed(loc.getCurrentSpeedMph());
                    return ResponseEntity.ok(ApiResponse.ok(trafficService.forecast(req)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/forecast/custom")
    public ApiResponse<ForecastResponse> getCustomForecast(@RequestBody ForecastRequest req) {
        return ApiResponse.ok(trafficService.forecast(req));
    }
}
