package com.trafficiq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "traffic_sensors")
public class TrafficSensorEntity {

    @Id
    @Column(name = "sensor_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String highway;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "speed_limit_mph")
    private Integer speedLimitMph;

    @Column(name = "average_speed_mph")
    private Double averageSpeedMph;

    @Column(name = "speed_std_mph")
    private Double speedStdMph;

    @Column(name = "congestion_percentage")
    private Double congestionPercentage;

    @Column(name = "benchmark_dataset")
    private String benchmarkDataset;

    public TrafficSensorEntity() {
    }

    public TrafficSensorEntity(Long id, String name, String highway, Double latitude, Double longitude,
                               Integer speedLimitMph, Double averageSpeedMph, Double speedStdMph,
                               Double congestionPercentage, String benchmarkDataset) {
        this.id = id;
        this.name = name;
        this.highway = highway;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speedLimitMph = speedLimitMph;
        this.averageSpeedMph = averageSpeedMph;
        this.speedStdMph = speedStdMph;
        this.congestionPercentage = congestionPercentage;
        this.benchmarkDataset = benchmarkDataset;
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

    public String getBenchmarkDataset() {
        return benchmarkDataset;
    }

    public void setBenchmarkDataset(String benchmarkDataset) {
        this.benchmarkDataset = benchmarkDataset;
    }
}
