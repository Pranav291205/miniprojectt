package com.trafficiq.dto;

import java.util.List;

public class ForecastResponse {

    private Long sensorId;
    private String locationName;
    private String highway;
    private Double latitude;
    private Double longitude;
    private Integer horizonMinutes;
    private Double predictedSpeedMph;
    private Double currentObservedSpeedMph;
    private Double baselineSpeedMph;
    private Double speedChangeMph;
    private String congestionLevel; // FREE_FLOW, MODERATE, HEAVY, SEVERE
    private String congestionColor; // green, yellow, orange, red
    private Double speedRatio; // predictedSpeed / freeflowSpeed
    private String modelArchitecture;
    private String inferenceEngine;
    private Long inferenceLatencyMs;
    private Boolean isDemoFallback;
    private List<RecentSpeedPoint> recentHistory;

    public static class RecentSpeedPoint {
        private String timeLabel;
        private Double speedMph;

        public RecentSpeedPoint() {}
        public RecentSpeedPoint(String timeLabel, Double speedMph) {
            this.timeLabel = timeLabel;
            this.speedMph = speedMph;
        }

        public String getTimeLabel() { return timeLabel; }
        public void setTimeLabel(String timeLabel) { this.timeLabel = timeLabel; }
        public Double getSpeedMph() { return speedMph; }
        public void setSpeedMph(Double speedMph) { this.speedMph = speedMph; }
    }

    public ForecastResponse() {
    }

    public Long getSensorId() {
        return sensorId;
    }

    public void setSensorId(Long sensorId) {
        this.sensorId = sensorId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getHighway() {
        return highway;
    }

    public void setHighway(String highway) {
        this.highway = highway;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getHorizonMinutes() {
        return horizonMinutes;
    }

    public void setHorizonMinutes(Integer horizonMinutes) {
        this.horizonMinutes = horizonMinutes;
    }

    public Double getPredictedSpeedMph() {
        return predictedSpeedMph;
    }

    public void setPredictedSpeedMph(Double predictedSpeedMph) {
        this.predictedSpeedMph = predictedSpeedMph;
    }

    public Double getCurrentObservedSpeedMph() {
        return currentObservedSpeedMph;
    }

    public void setCurrentObservedSpeedMph(Double currentObservedSpeedMph) {
        this.currentObservedSpeedMph = currentObservedSpeedMph;
    }

    public Double getBaselineSpeedMph() {
        return baselineSpeedMph;
    }

    public void setBaselineSpeedMph(Double baselineSpeedMph) {
        this.baselineSpeedMph = baselineSpeedMph;
    }

    public Double getSpeedChangeMph() {
        return speedChangeMph;
    }

    public void setSpeedChangeMph(Double speedChangeMph) {
        this.speedChangeMph = speedChangeMph;
    }

    public String getCongestionLevel() {
        return congestionLevel;
    }

    public void setCongestionLevel(String congestionLevel) {
        this.congestionLevel = congestionLevel;
    }

    public String getCongestionColor() {
        return congestionColor;
    }

    public void setCongestionColor(String congestionColor) {
        this.congestionColor = congestionColor;
    }

    public Double getSpeedRatio() {
        return speedRatio;
    }

    public void setSpeedRatio(Double speedRatio) {
        this.speedRatio = speedRatio;
    }

    public String getModelArchitecture() {
        return modelArchitecture;
    }

    public void setModelArchitecture(String modelArchitecture) {
        this.modelArchitecture = modelArchitecture;
    }

    public String getInferenceEngine() {
        return inferenceEngine;
    }

    public void setInferenceEngine(String inferenceEngine) {
        this.inferenceEngine = inferenceEngine;
    }

    public Long getInferenceLatencyMs() {
        return inferenceLatencyMs;
    }

    public void setInferenceLatencyMs(Long inferenceLatencyMs) {
        this.inferenceLatencyMs = inferenceLatencyMs;
    }

    public Boolean getIsDemoFallback() {
        return isDemoFallback;
    }

    public void setIsDemoFallback(Boolean isDemoFallback) {
        this.isDemoFallback = isDemoFallback;
    }

    public List<RecentSpeedPoint> getRecentHistory() {
        return recentHistory;
    }

    public void setRecentHistory(List<RecentSpeedPoint> recentHistory) {
        this.recentHistory = recentHistory;
    }
}
