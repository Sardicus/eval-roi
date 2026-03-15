package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.entity.BuyerProfile;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.enums.AgeGroup;
import com.naira.evalroi.enums.BudgetSensitivity;
import com.naira.evalroi.enums.HouseholdType;
import com.naira.evalroi.enums.PurchaseIntent;
import com.naira.evalroi.repository.BuyerProfileRepository;
import com.naira.evalroi.repository.ListingRepository;
import com.naira.evalroi.service.ScoringStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SimpleEvaluationService {

    private final List<ScoringStrategy> strategies;
    private final ListingRepository listingRepository;
    private final BuyerProfileRepository buyerProfileRepository;

    public SimpleEvaluationDto evaluate(Integer listingId, Integer profileId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));

        BuyerProfile profile = profileId != null
                ? buyerProfileRepository.findById(profileId).orElse(null)
                : null;

        List<CategoryScoreDto> categoryScores = new ArrayList<>();
        Map<String, Double> weights = getWeights(profile);
        double weightedTotal = 0;

        for (ScoringStrategy strategy : strategies) {
            CategoryScoreDto cat = strategy.calculateScore(listing);
            categoryScores.add(cat);
            double weight = weights.getOrDefault(cat.categoryName(), 1.0 / strategies.size());
            weightedTotal += (cat.score() / cat.maxScore()) * weight * 100;
        }

        return new SimpleEvaluationDto(
                listing.getId(),
                categoryScores,
                Math.round(weightedTotal * 10.0) / 10.0,
                getVerdict(weightedTotal)
        );
    }

    private Map<String, Double> getWeights(BuyerProfile profile) {
        double safetyWeight = 0.33;
        double priceWeight = 0.33;
        double featuresWeight = 0.34;

        if (profile != null) {
            // Priority base adjustments
            if (profile.getPriority() != null) {
                switch (profile.getPriority()) {
                    case SAFETY_FIRST         -> { safetyWeight += 0.15; priceWeight -= 0.08; featuresWeight -= 0.07; }
                    case VALUE_FOR_MONEY      -> { priceWeight += 0.15; safetyWeight -= 0.08; featuresWeight -= 0.07; }
                    case PREMIUM_COMFORT      -> { featuresWeight += 0.15; safetyWeight -= 0.07; priceWeight -= 0.08; }
                    case LOCATION_CONVENIENCE -> { featuresWeight += 0.10; priceWeight += 0.05; safetyWeight -= 0.15; }
                }
            }

            // Profile field adjustments
            if (Boolean.TRUE.equals(profile.getHasChildren()))            safetyWeight += 0.05;
            if (Boolean.TRUE.equals(profile.getHasDisabledMember()))      safetyWeight += 0.07;
            if (Boolean.TRUE.equals(profile.getWillingToRenovate()))      safetyWeight -= 0.05;
            if (profile.getPurchaseIntent() == PurchaseIntent.INVESTING)  priceWeight  += 0.10;
            if (profile.getBudgetSensitivity() == BudgetSensitivity.TIGHT) priceWeight += 0.07;
            if (profile.getHouseholdType() == HouseholdType.RETIREE)      featuresWeight += 0.05;
            if (profile.getAgeGroup() == AgeGroup.OVER_50)                featuresWeight += 0.03;
        }

        // Normalize to always sum to 1.0
        double total = safetyWeight + priceWeight + featuresWeight;
        return Map.of(
                "Building Safety", safetyWeight / total,
                "Price",           priceWeight / total,
                "Features",        featuresWeight / total
        );
    }

    private String getVerdict(double score) {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        if (score >= 20) return "Poor";
        return "Critical";
    }
}