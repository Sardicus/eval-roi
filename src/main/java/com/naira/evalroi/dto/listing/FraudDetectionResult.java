package com.naira.evalroi.dto.listing;

import java.util.List;

public record FraudDetectionResult(
        String verdict,
        int authenticityScore,
        List<String> redFlags,
        List<String> warnings
) {}