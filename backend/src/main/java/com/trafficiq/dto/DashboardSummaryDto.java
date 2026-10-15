package com.trafficiq.dto;

import java.util.Map;

public class DashboardSummaryDto {

    private Integer totalSensorsMonitored;
    private Double averageNetworkSpeedMph;
    private Integer freeFlowSensors;
    private Integer moderateSensors;
    private Integer congestedSensors;
    private Integer severeSensors;
    private Integer activeIncidentsCount;
    private String primaryHighwayCorridor;
    private String datasetBenchmark;
    private String modelStatus;
    private Double modelMae;
    private Double modelR2;
    private Map<String, Integer> congestionBreakdown;

    public DashboardSummaryDto() {
    }

    public Integer getTotalSensorsMonitored() {
        return totalSensorsMonitored;
    }

    public void setTotalSensorsMonitored(Integer totalSensorsMonitored) {
        this.totalSensorsMonitored = totalSensorsMonitored;
    }

    public Double getAverageNetworkSpeedMph() {
        return averageNetworkSpeedMph;
    }

    public void setAverageNetworkSpeedMph(Double averageNetworkSpeedMph) {
        this.averageNetworkSpeedMph = averageNetworkSpeedMph;
    }

    public Integer getFreeFlowSensors() {
        return freeFlowSensors;
    }

    public void setFreeFlowSensors(Integer freeFlowSensors) {
        this.freeFlowSensors = freeFlowSensors;
    }

    public Integer getModerateSensors() {
        return moderateSensors;
    }

    public void setModerateSensors(Integer moderateSensors) {
        this.moderateSensors = moderateSensors;
    }

    public Integer getCongestedSensors() {
        return congestedSensors;
    }

    public void setCongestedSensors(Integer congestedSensors) {
        this.congestedSensors = congestedSensors;
    }

    public Integer getSevereSensors() {
        return severeSensors;
    }

    public void setSevereSensors(Integer severeSensors) {
        this.severeSensors = severeSensors;
    }

    public Integer getActiveIncidentsCount() {
        return activeIncidentsCount;
    }

    public void setActiveIncidentsCount(Integer activeIncidentsCount) {
        this.activeIncidentsCount = activeIncidentsCount;
    }

    public String getPrimaryHighwayCorridor() {
        return primaryHighwayCorridor;
    }

    public void setPrimaryHighwayCorridor(String primaryHighwayCorridor) {
        this.primaryHighwayCorridor = primaryHighwayCorridor;
    }

    public String getDatasetBenchmark() {
        return datasetBenchmark;
    }

    public void setDatasetBenchmark(String datasetBenchmark) {
        this.datasetBenchmark = datasetBenchmark;
    }

    public String getModelStatus() {
        return modelStatus;
    }

    public void setModelStatus(String modelStatus) {
        this.modelStatus = modelStatus;
    }

    public Double getModelMae() {
        return modelMae;
    }

    public void setModelMae(Double modelMae) {
        this.modelMae = modelMae;
    }

    public Double getModelR2() {
        return modelR2;
    }

    public void setModelR2(Double modelR2) {
        this.modelR2 = modelR2;
    }

    public Map<String, Integer> getCongestionBreakdown() {
        return congestionBreakdown;
    }

    public void setCongestionBreakdown(Map<String, Integer> congestionBreakdown) {
        this.congestionBreakdown = congestionBreakdown;
    }
}
