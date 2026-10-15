package com.trafficiq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafficiq.dto.ForecastRequest;
import com.trafficiq.service.OnnxInferenceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TrafficIqApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OnnxInferenceService inferenceService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Application Context Loads and Inference Service is Active")
    void contextLoads() {
        assertNotNull(inferenceService, "Inference service should be injected");
        assertTrue(inferenceService.isModelLoaded(), "ONNX model should be loaded in test context");
    }

    @Test
    @DisplayName("GET /api/health returns UP status with model info")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.modelLoaded").value(true));
    }

    @Test
    @DisplayName("GET /api/dashboard/summary returns populated metrics and congestion breakdown")
    void testDashboardSummary() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalSensorsMonitored", greaterThan(200)))
                .andExpect(jsonPath("$.data.averageNetworkSpeedMph", greaterThan(0.0)))
                .andExpect(jsonPath("$.data.congestionBreakdown").isMap());
    }

    @Test
    @DisplayName("GET /api/traffic/locations returns valid sensor markers with coordinates")
    void testTrafficLocations() throws Exception {
        mockMvc.perform(get("/api/traffic/locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(200))))
                .andExpect(jsonPath("$.data[0].latitude", notNullValue()))
                .andExpect(jsonPath("$.data[0].longitude", notNullValue()))
                .andExpect(jsonPath("$.data[0].currentSpeedMph", greaterThan(0.0)));
    }

    @Test
    @DisplayName("GET /api/traffic/locations/{id}/forecast runs actual ONNX inference")
    void testLocationForecast() throws Exception {
        mockMvc.perform(get("/api/traffic/locations/400001/forecast?horizon=30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.horizonMinutes").value(30))
                .andExpect(jsonPath("$.data.predictedSpeedMph", greaterThan(0.0)))
                .andExpect(jsonPath("$.data.congestionLevel", notNullValue()))
                .andExpect(jsonPath("$.data.inferenceEngine", containsString("ONNX Runtime")));
    }

    @Test
    @DisplayName("POST /api/traffic/forecast/custom performs custom input inference")
    void testCustomForecast() throws Exception {
        ForecastRequest req = new ForecastRequest();
        req.setSensorId(400001L);
        req.setCurrentSpeed(62.0);
        req.setHorizon(15);
        req.setCustomLags(Arrays.asList(62.0, 61.5, 61.0, 60.5, 59.0, 58.0));

        mockMvc.perform(post("/api/traffic/forecast/custom")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.predictedSpeedMph", greaterThan(0.0)));
    }

    @Test
    @DisplayName("GET /api/model/status returns architecture and dataset information")
    void testModelStatus() throws Exception {
        mockMvc.perform(get("/api/model/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.inputDimensions").value(17))
                .andExpect(jsonPath("$.data.supportedHorizons", hasSize(3)));
    }

    @Test
    @DisplayName("GET /api/routes/plan calculates distance, duration, delay, and polyline")
    void testRoutePlan() throws Exception {
        mockMvc.perform(get("/api/routes/plan")
                        .param("originLat", "37.3382")
                        .param("originLon", "-121.8863")
                        .param("destLat", "37.3861")
                        .param("destLon", "-122.0839")
                        .param("originName", "San Jose")
                        .param("destName", "Mountain View"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalDistanceMiles", greaterThan(0.0)))
                .andExpect(jsonPath("$.data.estimatedDurationMinutes", greaterThan(0.0)))
                .andExpect(jsonPath("$.data.pathCoordinates", not(empty())));
    }

    @Test
    @DisplayName("GET /api/incidents returns list of seeded traffic incidents")
    void testIncidents() throws Exception {
        mockMvc.perform(get("/api/incidents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", not(empty())))
                .andExpect(jsonPath("$.data[0].isDemo").value(true));
    }
}
