package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.repository.ListingRepository;
import com.naira.evalroi.service.ScoringStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SimpleEvaluationService {

    private final List<ScoringStrategy> strategies;
    private final ListingRepository listingRepository;

    public SimpleEvaluationDto evaluate(Integer listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));

        List<CategoryScoreDto> categoryScores = new ArrayList<>();
        double total = 0;
        double maxTotal = 0;

        for (ScoringStrategy strategy : strategies) {
            CategoryScoreDto score = strategy.calculateScore(listing);
            categoryScores.add(score);
            total += score.score();
            maxTotal += score.maxScore();
        }

        return new SimpleEvaluationDto(
                listing.getId(),
                categoryScores,
                total,
                maxTotal,
                getVerdict(total, maxTotal)
        );
    }

    private String getVerdict(double total, double maxTotal) {
        double percentage = (total / maxTotal) * 100;
        if (percentage >= 80) return "Excellent";
        if (percentage >= 60) return "Good";
        if (percentage >= 40) return "Fair";
        if (percentage >= 20) return "Poor";
        return "Critical";
    }
}