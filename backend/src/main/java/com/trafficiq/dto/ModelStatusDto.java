package com.trafficiq.dto;

import java.util.List;
import java.util.Map;

public class ModelStatusDto {

    private String modelName;
    private String modelArchitecture;
    private String status; // LOADED_ONNX, LOADED_FALLBACK, NOT_FOUND
    private String inferenceEngine;
    private String inputTensor;
    private Integer inputDimensions;
    private List<Integer> supportedHorizons;
    private String speedUnit;
    private String trainedOnDataset;
    private Map<String, Object> testSetMetrics;
    private Map<String, Object> weatherAblation;

    public ModelStatusDto() {
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getModelArchitecture() {
        return modelArchitecture;
    }

    public void setModelArchitecture(String modelArchitecture) {
        this.modelArchitecture = modelArchitecture;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getInferenceEngine() {
        return inferenceEngine;
    }

    public void setInferenceEngine(String inferenceEngine) {
        this.inferenceEngine = inferenceEngine;
    }

    public String getInputTensor() {
        return inputTensor;
    }

    public void setInputTensor(String inputTensor) {
        this.inputTensor = inputTensor;
    }

    public Integer getInputDimensions() {
        return inputDimensions;
    }

    public void setInputDimensions(Integer inputDimensions) {
        this.inputDimensions = inputDimensions;
    }

    public List<Integer> getSupportedHorizons() {
        return supportedHorizons;
    }

    public void setSupportedHorizons(List<Integer> supportedHorizons) {
        this.supportedHorizons = supportedHorizons;
    }

    public String getSpeedUnit() {
        return speedUnit;
    }

    public void setSpeedUnit(String speedUnit) {
        this.speedUnit = speedUnit;
    }

    public String getTrainedOnDataset() {
        return trainedOnDataset;
    }

    public void setTrainedOnDataset(String trainedOnDataset) {
        this.trainedOnDataset = trainedOnDataset;
    }

    public Map<String, Object> getTestSetMetrics() {
        return testSetMetrics;
    }

    public void setTestSetMetrics(Map<String, Object> testSetMetrics) {
        this.testSetMetrics = testSetMetrics;
    }

    public Map<String, Object> getWeatherAblation() {
        return weatherAblation;
    }

    public void setWeatherAblation(Map<String, Object> weatherAblation) {
        this.weatherAblation = weatherAblation;
    }
}
