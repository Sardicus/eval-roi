package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.entity.BuyerProfile;
import com.naira.evalroi.entity.Listing;
import org.springframework.stereotype.Component;

@Component
public class EnhancedEvaluationPromptBuilder {

    public String buildSystemPrompt() {
        return """
                You are a professional Turkish real estate analyst with deep knowledge of the Turkish property market.
                You analyze properties and give personalized recommendations based on the buyer's profile and evaluation scores.
                You are direct, honest and data-driven. You always respond in valid JSON format only — no extra text, no markdown, no code blocks.
                """;
    }

    public String buildUserPrompt(Listing listing, BuyerProfile profile, SimpleEvaluationDto simpleEval) {
        return """
                Analyze this property for the given buyer profile and return a JSON response.
                
                PROPERTY:
                - Title: %s
                - Type: %s
                - Location: %s, %s
                - Price: ₺%s
                - Size: %sm², Living Area: %sm²
                - Bedrooms: %s, Bathrooms: %s, Rooms: %s
                - Floor: %s / %s
                - Build Year: %s
                - Heating: %s
                - Parking: %s | Elevator: %s | Balcony: %s | Garden: %s | Furnished: %s
                
                EVALUATION SCORES:
                %s
                
                BUYER PROFILE:
                - Profile Name: %s
                - Household: %s
                - Lifestyle: %s
                - Priority: %s
                - Budget Sensitivity: %s
                - Purchase Intent: %s
                - Age Group: %s
                - Has Children: %s
                - Has Pets: %s
                - Has Vehicle: %s
                - Has Disabled Member: %s
                - Willing to Renovate: %s
                - Min Size: %s m²
                - Min Bedrooms: %s
                - Budget Max: %s
                - Commute Importance: %s
                
                Respond with ONLY this JSON structure, no other text:
                {
                  "summary": "2-3 sentence overall assessment of this property",
                  "priceAnalysis": "price assessment specific to this buyer's budget and intent",
                  "safetyAnalysis": "safety assessment considering buyer's specific situation",
                  "featuresAnalysis": "features assessment relevant to this buyer's needs",
                  "recommendation": "BUY or CONSIDER or AVOID",
                  "recommendationReason": "1-2 sentence reason tailored to this buyer",
                  "confidence": "HIGH or MEDIUM or LOW",
                  "personalizedInsights": "specific insights based on their household, lifestyle and priorities"
                }
                """.formatted(
                listing.getTitle(),
                listing.getPropertyType(),
                listing.getAddress().getDistrict(), listing.getAddress().getCity(),
                listing.getPrice().toPlainString(),
                listing.getSizeM2(), listing.getLivingAreaM2(),
                listing.getBedroomCount(), listing.getBathroomCount(), listing.getRoomCount(),
                listing.getFloorNumber(), listing.getTotalFloors(),
                listing.getBuildYear(),
                listing.getHeatingType(),
                listing.getHasParking(), listing.getHasElevator(), listing.getHasBalcony(),
                listing.getHasGarden(), listing.getIsFurnished(),
                buildScoresSummary(simpleEval),
                profile.getProfileName(),
                profile.getHouseholdType(),
                profile.getLifestylePreference(),
                profile.getPriority(),
                profile.getBudgetSensitivity(),
                profile.getPurchaseIntent(),
                profile.getAgeGroup(),
                profile.getHasChildren(),
                profile.getHasPets(),
                profile.getHasVehicle(),
                profile.getHasDisabledMember(),
                profile.getWillingToRenovate(),
                profile.getMinSizeM2(),
                profile.getMinBedrooms(),
                profile.getBudgetMax(),
                profile.getCommuteImportance()
        );
    }

    private String buildScoresSummary(SimpleEvaluationDto simpleEval) {
        StringBuilder sb = new StringBuilder();
        sb.append("- Overall: %.1f/100 — %s%n".formatted(simpleEval.totalScore(), simpleEval.verdict()));
        for (CategoryScoreDto cat : simpleEval.categoryScores()) {
            sb.append("- %s: %.0f/100 — %s%n".formatted(cat.categoryName(), cat.score(), cat.verdict()));
            for (String factor : cat.factors()) {
                sb.append("  • %s%n".formatted(factor));
            }
        }
        return sb.toString();
    }
}
