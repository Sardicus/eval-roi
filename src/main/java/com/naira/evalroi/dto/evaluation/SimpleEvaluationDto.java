package com.naira.evalroi.dto.evaluation;

import java.util.List;

public record SimpleEvaluationDto(
        Integer listingId,
        List<CategoryScoreDto> categoryScores,
        Double totalScore,
        Double maxTotalScore,
        String verdict
) {}