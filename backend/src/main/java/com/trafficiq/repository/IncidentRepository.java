package com.trafficiq.repository;

import com.trafficiq.entity.IncidentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<IncidentEntity, Long> {

    List<IncidentEntity> findBySeverity(String severity);

    List<IncidentEntity> findByCategory(String category);

    List<IncidentEntity> findAllByOrderByCreatedAtDesc();
}
