package com.naira.evalroi.service;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.entity.Listing;

public interface ScoringStrategy {
    CategoryScoreDto calculateScore(Listing listing);
    String getCategoryName();
    String getVerdict(double score);
}