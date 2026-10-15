package com.trafficiq.dto;

import java.util.List;

public class ForecastRequest {

    private Long sensorId;
    private Integer horizon; // 15, 30, 60
    private Double currentSpeed; // optional custom current speed
    private List<Double> customLags; // optional historical lags [lag0, lag1, lag2, lag3, lag6, lag12]
    private Integer hour; // optional 0-23
    private Integer dayOfWeek; // optional 0-6

    public ForecastRequest() {
    }

    public Long getSensorId() {
        return sensorId;
    }

    public void setSensorId(Long sensorId) {
        this.sensorId = sensorId;
    }

    public Integer getHorizon() {
        return horizon != null ? horizon : 15;
    }

    public void setHorizon(Integer horizon) {
        this.horizon = horizon;
    }

    public Double getCurrentSpeed() {
        return currentSpeed;
    }

    public void setCurrentSpeed(Double currentSpeed) {
        this.currentSpeed = currentSpeed;
    }

    public List<Double> getCustomLags() {
        return customLags;
    }

    public void setCustomLags(List<Double> customLags) {
        this.customLags = customLags;
    }

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}
