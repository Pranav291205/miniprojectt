package com.trafficiq.repository;

import com.trafficiq.entity.TrafficSensorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficSensorRepository extends JpaRepository<TrafficSensorEntity, Long> {

    List<TrafficSensorEntity> findByHighway(String highway);

    List<TrafficSensorEntity> findByCongestionPercentageGreaterThan(Double minCongestion);
}
