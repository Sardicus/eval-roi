package com.naira.evalroi.dto.evaluation.simple;

public record CategoryScoreDto(
        String categoryName,
        Double score,
        Double maxScore,
        String verdict
) {}