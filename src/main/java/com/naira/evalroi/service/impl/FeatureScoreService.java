package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.CategoryScoreDto;
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

        double total;
        if (isVillaType(type)) {
            total = calculateVillaScore(listing);
        } else if (isCommercialType(type)) {
            total = calculateCommercialScore(listing);
        } else {
            total = calculateApartmentScore(listing);
        }

        return new CategoryScoreDto(getCategoryName(), total, 100.0, getVerdict(total));
    }

    private double calculateApartmentScore(Listing listing) {
        double score = 0;
        if (Boolean.TRUE.equals(listing.getHasParking())) score += 25;
        if (Boolean.TRUE.equals(listing.getHasElevator())) score += 25;
        if (Boolean.TRUE.equals(listing.getHasBalcony())) score += 20;
        if (Boolean.TRUE.equals(listing.getHasGarden())) score += 15;
        if (Boolean.TRUE.equals(listing.getIsFurnished())) score += 15;
        return score;
    }

    private double calculateVillaScore(Listing listing) {
        double score = 0;
        if (Boolean.TRUE.equals(listing.getHasParking())) score += 30;
        if (Boolean.TRUE.equals(listing.getHasGarden())) score += 35;
        if (Boolean.TRUE.equals(listing.getHasBalcony())) score += 25;
        if (Boolean.TRUE.equals(listing.getIsFurnished())) score += 10;
        return score;
    }

    private double calculateCommercialScore(Listing listing) {
        double score = 0;
        if (Boolean.TRUE.equals(listing.getHasParking())) score += 50;
        if (Boolean.TRUE.equals(listing.getHasElevator())) score += 30;
        if (Boolean.TRUE.equals(listing.getIsFurnished())) score += 20;
        return score;
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

    private String getVerdict(double score) {
        if (score >= 80) return "Excellent - Fully equipped property";
        if (score >= 60) return "Good - Well featured property";
        if (score >= 40) return "Fair - Basic features present";
        return "Poor - Missing key features";
    }
}
