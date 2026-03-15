package com.naira.evalroi.dto.evaluation.enhanced;

public record EnhancedEvaluationResponse(
        Integer listingId,
        String profileName,
        String summary,
        String priceAnalysis,
        String safetyAnalysis,
        String featuresAnalysis,
        String recommendation,
        String recommendationReason,
        String confidence,
        String personalizedInsights
) {}