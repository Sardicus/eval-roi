package com.naira.evalroi.controller;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import com.naira.evalroi.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("listing")
public class ListingController {

    private final ListingService listingService;

    @PostMapping("create")
    public ResponseEntity<ListingResponseDto> createListing(
            @RequestBody @Valid CreateListingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(listingService.createListing(request, userDetails.getUsername()));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteListing(
            @PathVariable Integer id ,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        listingService.deleteListing(id, userDetails.getUsername());
        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<ListingResponseDto> getListing(@PathVariable Integer id) {
        return new ResponseEntity<>(listingService.getListingById(id), HttpStatus.OK);
    }
}
