package com.trafficiq.service;

import com.trafficiq.entity.IncidentEntity;
import com.trafficiq.repository.IncidentRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentService {

    private static final Logger log = LoggerFactory.getLogger(IncidentService.class);

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @PostConstruct
    public void init() {
        if (incidentRepository.count() == 0) {
            log.info("Seeding initial traffic incidents for demonstration...");
            List<IncidentEntity> seeds = new ArrayList<>();
            seeds.add(new IncidentEntity(
                    "Multi-Vehicle Fender Bender",
                    "Two passenger cars stalled on the right shoulder, causing 15-minute residual slowdown.",
                    "US-101 Northbound near Trimble Rd",
                    37.3752, -121.9184,
                    "MEDIUM", "ACCIDENT",
                    LocalDateTime.now().minusMinutes(24), true
            ));
            seeds.add(new IncidentEntity(
                    "Evening Peak Bottle-neck Congestion",
                    "Heavy commuter volume merging onto I-880 Northbound connector. Average speed down to 26 mph.",
                    "I-880 Junction / Montague Expy",
                    37.4045, -121.9022,
                    "HIGH", "CONGESTION",
                    LocalDateTime.now().minusMinutes(12), true
            ));
            seeds.add(new IncidentEntity(
                    "Scheduled Lane Maintenance",
                    "Right lane closed for sensor calibration and guardrail inspection until 04:00 AM.",
                    "SR-85 Southbound near Saratoga Ave",
                    37.2751, -122.0124,
                    "LOW", "ROADWORK",
                    LocalDateTime.now().minusHours(2), true
            ));
            seeds.add(new IncidentEntity(
                    "Roadway Debris Cleared",
                    "Tire remnants on center divider reported by highway patrol; sweep truck dispatched.",
                    "I-280 Northbound near De Anza Blvd",
                    37.3241, -122.0321,
                    "LOW", "HAZARD",
                    LocalDateTime.now().minusMinutes(45), true
            ));
            incidentRepository.saveAll(seeds);
            log.info("Seeded {} demo traffic incidents", seeds.size());
        }
    }

    public List<IncidentEntity> getAllIncidents(String severity, String category) {
        if (severity != null && !severity.isBlank() && !"ALL".equalsIgnoreCase(severity)) {
            return incidentRepository.findBySeverity(severity.toUpperCase());
        }
        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            return incidentRepository.findByCategory(category.toUpperCase());
        }
        return incidentRepository.findAllByOrderByCreatedAtDesc();
    }

    public IncidentEntity createIncident(IncidentEntity incident) {
        if (incident.getCreatedAt() == null) {
            incident.setCreatedAt(LocalDateTime.now());
        }
        incident.setIsDemo(true);
        return incidentRepository.save(incident);
    }
}
