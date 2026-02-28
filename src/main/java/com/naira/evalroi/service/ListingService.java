package com.naira.evalroi.service;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListingService {
    ListingResponseDto createListing(CreateListingRequest request, String userIdentifier);
    ListingResponseDto getListingById(Integer id);
    List<ListingResponseDto> getListings();
    void deleteListing(Integer id, String userIdentifier);
    ListingResponseDto updateListing(Integer id, CreateListingRequest request, String userIdentifier);
    ListingResponseDto addImagesToListing(Integer listingId, List<MultipartFile> files, String userIdentifier);
    void deleteImageFromListing(Integer listingId,Integer imageId, String userIdentifier);
    void setPrimaryImageForListing(Integer listingId,Integer imageId, String userIdentifier);
}
