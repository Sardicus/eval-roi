package com.naira.evalroi.mapper;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import com.naira.evalroi.entity.Listing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring" ,
        uses = {AddressMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE) // componentModel = "spring" is a close equivalent of a @Component, can't use that annotation in interfaces so we use this.
public interface ListingMapper {

    ListingResponseDto toResponseDTO(Listing listing);

    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "user", ignore = true)
    Listing toEntity(CreateListingRequest request);
}
