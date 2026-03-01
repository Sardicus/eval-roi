package com.naira.evalroi.controller;

import com.naira.evalroi.dto.evaluation.SimpleEvaluationDto;
import com.naira.evalroi.service.impl.SimpleEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("evaluation")
public class EvaluationController {

    private final SimpleEvaluationService simpleEvaluationService;

    @GetMapping("/simple/{listingId}")
    public ResponseEntity<SimpleEvaluationDto> getSimpleEvaluation(
            @PathVariable Integer listingId
    ) {
        return ResponseEntity.ok(simpleEvaluationService.evaluate(listingId));
    }
}
