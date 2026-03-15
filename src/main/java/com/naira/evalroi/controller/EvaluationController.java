package com.naira.evalroi.controller;

import com.naira.evalroi.dto.evaluation.enhanced.EnhancedEvaluationResponse;
import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.entity.BuyerProfile;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.service.BuyerProfileService;
import com.naira.evalroi.service.ListingService;
import com.naira.evalroi.service.impl.EnhancedEvaluationService;
import com.naira.evalroi.service.impl.SimpleEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("evaluation")
public class EvaluationController {

    private final SimpleEvaluationService simpleEvaluationService;
    private final EnhancedEvaluationService enhancedEvaluationService;
    private final ListingService listingService;
    private final BuyerProfileService buyerProfileService;

    @GetMapping("/simple/{listingId}")
    public ResponseEntity<SimpleEvaluationDto> getSimpleEvaluation(
            @PathVariable Integer listingId
    ) {
        return ResponseEntity.ok(simpleEvaluationService.evaluate(listingId));
    }

    @GetMapping("/enhanced/{listingId}")
    public ResponseEntity<EnhancedEvaluationResponse> getEnhancedEvaluation(
            @PathVariable Integer listingId,
            @RequestParam Integer profileId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                enhancedEvaluationService.evaluate(listingId, profileId, userDetails.getUsername()));

    }

}
