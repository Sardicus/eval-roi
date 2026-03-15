package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.enums.PropertyType;
import com.naira.evalroi.service.ScoringStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeatureScoreService implements ScoringStrategy {

    @Override
    public String getCategoryName() {
        return "Features";
    }

    @Override
    public CategoryScoreDto calculateScore(Listing listing) {
        PropertyType type = listing.getPropertyType();
        ScoreAccumulator acc = new ScoreAccumulator();

        if (isVillaType(type)) {
            if (Boolean.TRUE.equals(listing.getHasParking()))  acc.add(30, "Parking available (+30)");
            if (Boolean.TRUE.equals(listing.getHasGarden()))   acc.add(35, "Garden available (+35)");
            if (Boolean.TRUE.equals(listing.getHasBalcony()))  acc.add(25, "Balcony available (+25)");
            if (Boolean.TRUE.equals(listing.getIsFurnished())) acc.add(10, "Furnished (+10)");
        } else if (isCommercialType(type)) {
            if (Boolean.TRUE.equals(listing.getHasParking()))  acc.add(50, "Parking available (+50)");
            if (Boolean.TRUE.equals(listing.getHasElevator())) acc.add(30, "Elevator available (+30)");
            if (Boolean.TRUE.equals(listing.getIsFurnished())) acc.add(20, "Furnished (+20)");
        } else {
            if (Boolean.TRUE.equals(listing.getHasParking()))  acc.add(25, "Parking available (+25)");
            if (Boolean.TRUE.equals(listing.getHasElevator())) acc.add(25, "Elevator available (+25)");
            if (Boolean.TRUE.equals(listing.getHasBalcony()))  acc.add(20, "Balcony available (+20)");
            if (Boolean.TRUE.equals(listing.getHasGarden()))   acc.add(15, "Garden available (+15)");
            if (Boolean.TRUE.equals(listing.getIsFurnished())) acc.add(15, "Furnished (+15)");
        }

        double score = acc.getScore();
        return new CategoryScoreDto(getCategoryName(), score, 100.0, getVerdict(score), acc.getFactors());
    }

    private boolean isVillaType(PropertyType type) {
        return type == PropertyType.VILLA
                || type == PropertyType.DETACHED_HOUSE
                || type == PropertyType.FARMHOUSE
                || type == PropertyType.DUPLEX
                || type == PropertyType.TRIPLEX;
    }

    private boolean isCommercialType(PropertyType type) {
        return type == PropertyType.OFFICE
                || type == PropertyType.SHOP
                || type == PropertyType.WAREHOUSE
                || type == PropertyType.HOTEL
                || type == PropertyType.PLAZA
                || type == PropertyType.BUILDING;
    }

    @Override
    public String getVerdict(double score) {
        if (score >= 80) return "Excellent - Fully equipped property";
        if (score >= 60) return "Good - Well featured property";
        if (score >= 40) return "Fair - Basic features present";
        return "Poor - Missing key features";
    }
}
