package com.naira.evalroi.dto.evaluation.enhanced;

import lombok.Data;

@Data
public class EnhancedEvaluationResponse{
    Integer listingId;
    String profileName;
    String summary;
    String priceAnalysis;
    String safetyAnalysis;
    String featuresAnalysis;
    String recommendation;
    String recommendationReason;
    String confidence;
    String personalizedInsights;
}