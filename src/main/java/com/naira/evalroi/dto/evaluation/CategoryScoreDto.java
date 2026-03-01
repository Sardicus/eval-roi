package com.naira.evalroi.dto.evaluation;

public record CategoryScoreDto(
        String categoryName,
        Double score,
        Double maxScore,
        String verdict
) {}