package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import com.trafficiq.dto.RoutePlanDto;
import com.trafficiq.service.RoutingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RoutingService routingService;

    public RouteController(RoutingService routingService) {
        this.routingService = routingService;
    }

    @GetMapping("/plan")
    public ApiResponse<RoutePlanDto> planRoute(
            @RequestParam(required = false) Double originLat,
            @RequestParam(required = false) Double originLon,
            @RequestParam(required = false) Double destLat,
            @RequestParam(required = false) Double destLon,
            @RequestParam(required = false) String originName,
            @RequestParam(required = false) String destName) {
        RoutePlanDto plan = routingService.planRoute(originLat, originLon, destLat, destLon, originName, destName);
        return ApiResponse.ok(plan);
    }
}
