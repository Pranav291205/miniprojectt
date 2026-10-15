package com.trafficiq.controller;

import com.trafficiq.dto.ApiResponse;
import com.trafficiq.dto.ModelStatusDto;
import com.trafficiq.service.OnnxInferenceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/model")
public class ModelController {

    private final OnnxInferenceService inferenceService;

    public ModelController(OnnxInferenceService inferenceService) {
        this.inferenceService = inferenceService;
    }

    @GetMapping("/status")
    public ApiResponse<ModelStatusDto> getModelStatus() {
        ModelStatusDto dto = new ModelStatusDto();
        dto.setModelName("TrafficIQ GBDT Forecaster");
        dto.setModelArchitecture("HistGradientBoostingRegressor (ONNX Opset 14)");
        dto.setStatus(inferenceService.isModelLoaded() ? "LOADED_ONNX" : "LOADED_FALLBACK");
        dto.setInferenceEngine(inferenceService.getInferenceEngine());
        dto.setInputTensor("float_input");
        dto.setInputDimensions(17);
        dto.setSupportedHorizons(Arrays.asList(15, 30, 60));
        dto.setSpeedUnit("mph");
        dto.setTrainedOnDataset("PEMS-BAY (Caltrans PeMS District 4, CA)");

        Map<String, Object> report = inferenceService.getEvaluationReport();
        if (report != null && report.containsKey("models")) {
            dto.setTestSetMetrics(report);
            if (report.containsKey("weather_ablation")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> ablation = (Map<String, Object>) report.get("weather_ablation");
                dto.setWeatherAblation(ablation);
            }
        }
        return ApiResponse.ok(dto);
    }

    @GetMapping("/metrics")
    public ApiResponse<Map<String, Object>> getModelMetrics() {
        return ApiResponse.ok(inferenceService.getEvaluationReport());
    }

    @GetMapping("/sample-eval")
    public ApiResponse<List<Map<String, Object>>> getSampleEvalPoints() {
        return ApiResponse.ok(inferenceService.getSampleEvalPoints());
    }
}
