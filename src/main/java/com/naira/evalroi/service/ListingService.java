package com.naira.evalroi.service;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ListingService {
    ListingResponseDto createListing(CreateListingRequest request, String userIdentifier);
    ListingResponseDto getListingById(Integer id);
//    List<ListingResponseDto> getListings();
    Page<ListingResponseDto> getListings(String title, String city, PropertyType propertyType, ListingStatus status, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable, Integer profileId);
    List<ListingResponseDto> getListingsByUser(String userIdentifier);
    void deleteListing(Integer id, String userIdentifier);
    ListingResponseDto updateListing(Integer id, CreateListingRequest request, String userIdentifier);
    ListingResponseDto addImagesToListing(Integer listingId, List<MultipartFile> files, String userIdentifier);
    void deleteImageFromListing(Integer listingId,Integer imageId, String userIdentifier);
    void setPrimaryImageForListing(Integer listingId,Integer imageId, String userIdentifier);
    void updateListingStatus(Integer listingId, String status, String userIdentifier);
}
