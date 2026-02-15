package com.naira.evalroi.service;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;

public interface ListingService {
    ListingResponseDto createListing(CreateListingRequest request, String userIdentifier);
    ListingResponseDto getListingById(Integer id);
    void deleteListing(Integer id, String userIdentifier);
}
