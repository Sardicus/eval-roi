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
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

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

    @PutMapping("/updateListing/{id}")
    public ResponseEntity<ListingResponseDto> updateListing(
            @PathVariable Integer id,
            @RequestBody @Valid CreateListingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(listingService.updateListing(id, request, userDetails.getUsername())
        );
    }

    @GetMapping("getAllListings")
    public ResponseEntity<List<ListingResponseDto>> getAllListings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return new ResponseEntity<>(listingService.getListings(), HttpStatus.OK);
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

    @PostMapping("/{id}/images")
    public ResponseEntity<ListingResponseDto> uploadImagesToListing(
            @PathVariable Integer id,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(listingService.addImagesToListing(id, Arrays.asList(files), userDetails.getUsername())
        );
    }

    @DeleteMapping("delete/{listingId}/{imgId}")
    public ResponseEntity<String> deleteImageFromListing(
            @PathVariable Integer listingId ,
            @PathVariable Integer imgId ,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        listingService.deleteImageFromListing(listingId, imgId, userDetails.getUsername());
        return new ResponseEntity<>("Image deleted successfully", HttpStatus.OK);
    }

    @PostMapping("primaryImage/{listingId}/{imgId}")
    public ResponseEntity<String> setPrimaryImageToListing(
            @PathVariable Integer listingId ,
            @PathVariable Integer imgId ,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        listingService.setPrimaryImageForListing(listingId, imgId, userDetails.getUsername());
        return new ResponseEntity<>("Image set as primary successfully", HttpStatus.OK);
    }
}