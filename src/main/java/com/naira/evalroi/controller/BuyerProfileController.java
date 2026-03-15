package com.naira.evalroi.controller;

import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileRequest;
import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileResponse;
import com.naira.evalroi.service.BuyerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buyer-profile")
@RequiredArgsConstructor
public class BuyerProfileController {

    private final BuyerProfileService buyerProfileService;

    @GetMapping("/getAll")
    public ResponseEntity<List<BuyerProfileResponse>> getUserProfiles(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(buyerProfileService.getUserProfiles(userDetails.getUsername()));
    }

    @PostMapping("/create")
    public ResponseEntity<BuyerProfileResponse> createProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid BuyerProfileRequest request
    ) {
        return new ResponseEntity<>(buyerProfileService.createProfile(userDetails.getUsername(), request), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BuyerProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id,
            @RequestBody @Valid BuyerProfileRequest request
    ) {
        return ResponseEntity.ok(buyerProfileService.updateProfile(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id
    ) {
        buyerProfileService.deleteProfile(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
