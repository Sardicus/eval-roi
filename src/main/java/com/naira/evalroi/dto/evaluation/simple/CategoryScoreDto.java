package com.naira.evalroi.dto.evaluation.simple;

import java.util.List;

public record CategoryScoreDto(
        String categoryName,
        Double score,
        Double maxScore,
        String verdict,
        List<String> factors
) {}