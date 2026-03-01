package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.CategoryScoreDto;
import com.naira.evalroi.entity.District;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.repository.DistrictRepository;
import com.naira.evalroi.service.ScoringStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class BuildingSafetyScoreService implements ScoringStrategy {

    private final DistrictRepository districtRepository;

    @Override
    public String getCategoryName() {
        return "Building Safety";
    }

    @Override
    public CategoryScoreDto calculateScore(Listing listing) {
        double buildYearScore = getBuildYearScore(listing.getBuildYear());
        double earthquakeRiskScore = getEarthquakeRiskScore(listing.getAddress().getDistrict());
        double floorRiskScore = getFloorRiskScore(listing.getFloorNumber(), listing.getTotalFloors(), listing.getBuildYear());
        double total = buildYearScore + earthquakeRiskScore + floorRiskScore;

        return new CategoryScoreDto(
                getCategoryName(),
                total,
                100.0,
                getVerdict(total)
        );
    }

    private double getBuildYearScore(Integer buildYear) {
        if (buildYear == null) return 25;
        if (buildYear >= 2019) return 50;
        if (buildYear >= 2007) return 40;
        if (buildYear >= 2000) return 30;
        if (buildYear >= 1999) return 20;
        if (buildYear >= 1975) return 10;
        return 5;
    }

    private double getEarthquakeRiskScore(String districtName) {
        if (districtName == null) return 17;
        Optional<District> district = districtRepository.findByName(districtName);

        if (district.isEmpty()) return 17;

        return switch (district.get().getEarthquakeRiskZone()) {
            case LOW -> 35;
            case MEDIUM -> 25;
            case HIGH -> 15;
            case VERY_HIGH -> 5;
        };
    }

    private double getFloorRiskScore(Integer floorNumber, Integer totalFloors, Integer buildYear) {
        if (floorNumber == null || totalFloors == null) return 7;

        boolean isOldBuilding = buildYear != null && buildYear < 2000;
        boolean isTopFloor = floorNumber.equals(totalFloors);
        boolean isGroundFloor = floorNumber == 1;
        boolean isTallBuilding = totalFloors > 10;

        if (isOldBuilding && isTopFloor) return 2;
        if (isOldBuilding && isTallBuilding) return 4;
        if (isOldBuilding && isGroundFloor) return 6;
        if (isOldBuilding) return 7;
        if (isTallBuilding && isTopFloor) return 10;
        if (isGroundFloor) return 12;
        return 15;
    }

    private String getVerdict(double score) {
        if (score >= 80) return "Excellent - Very safe building";
        if (score >= 60) return "Good - Reasonably safe building";
        if (score >= 40) return "Fair - Some safety concerns";
        if (score >= 20) return "Poor - Significant safety concerns";
        return "Critical - High risk building";
    }
}
