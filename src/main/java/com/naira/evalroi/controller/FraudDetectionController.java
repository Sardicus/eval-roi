package com.naira.evalroi.controller;

import com.naira.evalroi.dto.listing.FraudDetectionResult;
import com.naira.evalroi.dto.listing.ParsedListingData;
import com.naira.evalroi.service.impl.FraudDetectionService;
import com.naira.evalroi.service.impl.ListingTextParser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fraud")
@RequiredArgsConstructor
public class FraudDetectionController {

    private final ListingTextParser listingTextParser;
    private final FraudDetectionService fraudDetectionService;

    @PostMapping(value = "/parse", consumes = "text/plain")
    public ResponseEntity<ParsedListingData> parseRawListingText(
            @RequestBody String rawText,
            @AuthenticationPrincipal UserDetails userDetails) {
        ParsedListingData parsedListingData = listingTextParser.parseWithClaude(rawText);
        return ResponseEntity.ok(parsedListingData);
    }

    @PostMapping(value = "/analyze")
    public ResponseEntity<FraudDetectionResult> analyze(
            @RequestBody ParsedListingData request,
            @AuthenticationPrincipal UserDetails userDetails) {
        FraudDetectionResult result = fraudDetectionService.analyzeRules(request);
        return ResponseEntity.ok(result);
    }
}