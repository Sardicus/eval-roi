package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
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
        ScoreAccumulator acc = new ScoreAccumulator();

        // Build year
        Integer buildYear = listing.getBuildYear();
        if (buildYear == null)       acc.add(25, "Build year unknown, default applied (+25)");
        else if (buildYear >= 2019)  acc.add(50, "Build year " + buildYear + ": Modern construction (+50)");
        else if (buildYear >= 2007)  acc.add(40, "Build year " + buildYear + ": Post-2007 earthquake code (+40)");
        else if (buildYear >= 2000)  acc.add(30, "Build year " + buildYear + ": Early 2000s construction (+30)");
        else if (buildYear >= 1999)  acc.add(20, "Build year " + buildYear + ": Pre-2000 construction (+20)");
        else if (buildYear >= 1975)  acc.add(10, "Build year " + buildYear + ": Aging construction (+10)");
        else                         acc.add(5,  "Build year " + buildYear + ": Very old construction (+5)");

        // Earthquake zone
        String districtName = listing.getAddress().getDistrict();
        if (districtName == null) {
            acc.add(17, "Earthquake zone unknown, default applied (+17)");
        } else {
            Optional<District> district = districtRepository.findByName(districtName);
            if (district.isEmpty()) {
                acc.add(17, "Earthquake zone not found for " + districtName + ", default applied (+17)");
            } else {
                switch (district.get().getEarthquakeRiskZone()) {
                    case LOW       -> acc.add(35, "Earthquake zone: LOW risk (+35)");
                    case MEDIUM    -> acc.add(25, "Earthquake zone: MEDIUM risk (+25)");
                    case HIGH      -> acc.add(15, "Earthquake zone: HIGH risk (+15)");
                    case VERY_HIGH -> acc.add(5,  "Earthquake zone: VERY HIGH risk (+5)");
                }
            }
        }

        // Floor risk
        Integer floorNumber = listing.getFloorNumber();
        Integer totalFloors = listing.getTotalFloors();
        if (floorNumber == null || totalFloors == null) {
            acc.add(7, "Floor data missing, default applied (+7)");
        } else {
            boolean isOld = buildYear != null && buildYear < 2000;
            boolean isTop = floorNumber.equals(totalFloors);
            boolean isGround = floorNumber == 1;
            boolean isTall = totalFloors > 10;

            if (isOld && isTop)       acc.add(2,  "Old building, top floor — high risk (+2)");
            else if (isOld && isTall) acc.add(4,  "Old tall building — elevated risk (+4)");
            else if (isOld && isGround) acc.add(6, "Old building, ground floor (+6)");
            else if (isOld)           acc.add(7,  "Old building (+7)");
            else if (isTall && isTop) acc.add(10, "New tall building, top floor (+10)");
            else if (isGround)        acc.add(12, "Ground floor (+12)");
            else                      acc.add(15, "Safe floor position (+15)");
        }

        double score = acc.getScore();
        return new CategoryScoreDto(getCategoryName(), score, 100.0, getVerdict(score), acc.getFactors());
    }

    @Override
    public String getVerdict(double score) {
        if (score >= 80) return "Excellent - Very safe building";
        if (score >= 60) return "Good - Reasonably safe building";
        if (score >= 40) return "Fair - Some safety concerns";
        if (score >= 20) return "Poor - Significant safety concerns";
        return "Critical - High risk building";
    }
}
