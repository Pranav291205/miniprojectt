package com.trafficiq.dto;

import java.util.List;

public class LocationDto {

    private Long id;
    private String name;
    private String highway;
    private Double latitude;
    private Double longitude;
    private Integer speedLimitMph;
    private Double currentSpeedMph;
    private Double averageSpeedMph;
    private Double speedStdMph;
    private Double congestionPercentage;
    private String congestionLevel; // FREE_FLOW, MODERATE, HEAVY, SEVERE
    private String congestionColor; // #10b981 (green), #eab308 (yellow), #f97316 (orange), #ef4444 (red)
    private String region;
    private String benchmarkDataset;
    private List<ForecastResponse.RecentSpeedPoint> recentHistory;

    public LocationDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Integer getSpeedLimitMph() {
        return speedLimitMph;
    }

    public void setSpeedLimitMph(Integer speedLimitMph) {
        this.speedLimitMph = speedLimitMph;
    }

    public Double getCurrentSpeedMph() {
        return currentSpeedMph;
    }

    public void setCurrentSpeedMph(Double currentSpeedMph) {
        this.currentSpeedMph = currentSpeedMph;
    }

    public Double getAverageSpeedMph() {
        return averageSpeedMph;
    }

    public void setAverageSpeedMph(Double averageSpeedMph) {
        this.averageSpeedMph = averageSpeedMph;
    }

    public Double getSpeedStdMph() {
        return speedStdMph;
    }

    public void setSpeedStdMph(Double speedStdMph) {
        this.speedStdMph = speedStdMph;
    }

    public Double getCongestionPercentage() {
        return congestionPercentage;
    }

    public void setCongestionPercentage(Double congestionPercentage) {
        this.congestionPercentage = congestionPercentage;
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

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getBenchmarkDataset() {
        return benchmarkDataset;
    }

    public void setBenchmarkDataset(String benchmarkDataset) {
        this.benchmarkDataset = benchmarkDataset;
    }

    public List<ForecastResponse.RecentSpeedPoint> getRecentHistory() {
        return recentHistory;
    }

    public void setRecentHistory(List<ForecastResponse.RecentSpeedPoint> recentHistory) {
        this.recentHistory = recentHistory;
    }
}
