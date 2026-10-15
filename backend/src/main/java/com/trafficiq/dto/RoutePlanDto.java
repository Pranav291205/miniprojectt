package com.trafficiq.dto;

import java.util.List;

public class RoutePlanDto {

    private String originName;
    private String destinationName;
    private Double originLat;
    private Double originLon;
    private Double destLat;
    private Double destLon;
    private Double totalDistanceMiles;
    private Double estimatedDurationMinutes;
    private Double freeFlowDurationMinutes;
    private Double trafficDelayMinutes;
    private String overallCongestionStatus; // SMOOTH, SLOW, CONGESTED
    private String routingProvider; // OSRM Demo / Bay Area Corridor Routing Engine
    private Boolean isSimulatedDemo;
    private List<RouteSegment> segments;
    private List<List<Double>> pathCoordinates; // [[lon, lat], [lon, lat], ...]

    public static class RouteSegment {
        private String highwayName;
        private Double segmentDistanceMiles;
        private Double currentSpeedMph;
        private String status;

        public RouteSegment() {}
        public RouteSegment(String highwayName, Double segmentDistanceMiles, Double currentSpeedMph, String status) {
            this.highwayName = highwayName;
            this.segmentDistanceMiles = segmentDistanceMiles;
            this.currentSpeedMph = currentSpeedMph;
            this.status = status;
        }

        public String getHighwayName() { return highwayName; }
        public void setHighwayName(String highwayName) { this.highwayName = highwayName; }
        public Double getSegmentDistanceMiles() { return segmentDistanceMiles; }
        public void setSegmentDistanceMiles(Double segmentDistanceMiles) { this.segmentDistanceMiles = segmentDistanceMiles; }
        public Double getCurrentSpeedMph() { return currentSpeedMph; }
        public void setCurrentSpeedMph(Double currentSpeedMph) { this.currentSpeedMph = currentSpeedMph; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public RoutePlanDto() {
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public Double getOriginLat() {
        return originLat;
    }

    public void setOriginLat(Double originLat) {
        this.originLat = originLat;
    }

    public Double getOriginLon() {
        return originLon;
    }

    public void setOriginLon(Double originLon) {
        this.originLon = originLon;
    }

    public Double getDestLat() {
        return destLat;
    }

    public void setDestLat(Double destLat) {
        this.destLat = destLat;
    }

    public Double getDestLon() {
        return destLon;
    }

    public void setDestLon(Double destLon) {
        this.destLon = destLon;
    }

    public Double getTotalDistanceMiles() {
        return totalDistanceMiles;
    }

    public void setTotalDistanceMiles(Double totalDistanceMiles) {
        this.totalDistanceMiles = totalDistanceMiles;
    }

    public Double getEstimatedDurationMinutes() {
        return estimatedDurationMinutes;
    }

    public void setEstimatedDurationMinutes(Double estimatedDurationMinutes) {
        this.estimatedDurationMinutes = estimatedDurationMinutes;
    }

    public Double getFreeFlowDurationMinutes() {
        return freeFlowDurationMinutes;
    }

    public void setFreeFlowDurationMinutes(Double freeFlowDurationMinutes) {
        this.freeFlowDurationMinutes = freeFlowDurationMinutes;
    }

    public Double getTrafficDelayMinutes() {
        return trafficDelayMinutes;
    }

    public void setTrafficDelayMinutes(Double trafficDelayMinutes) {
        this.trafficDelayMinutes = trafficDelayMinutes;
    }

    public String getOverallCongestionStatus() {
        return overallCongestionStatus;
    }

    public void setOverallCongestionStatus(String overallCongestionStatus) {
        this.overallCongestionStatus = overallCongestionStatus;
    }

    public String getRoutingProvider() {
        return routingProvider;
    }

    public void setRoutingProvider(String routingProvider) {
        this.routingProvider = routingProvider;
    }

    public Boolean getIsSimulatedDemo() {
        return isSimulatedDemo;
    }

    public void setIsSimulatedDemo(Boolean isSimulatedDemo) {
        this.isSimulatedDemo = isSimulatedDemo;
    }

    public List<RouteSegment> getSegments() {
        return segments;
    }

    public void setSegments(List<RouteSegment> segments) {
        this.segments = segments;
    }

    public List<List<Double>> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<List<Double>> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }
}
