package com.naira.evalroi.mapper;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.entity.ListingImage;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring" ,
        uses = {AddressMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE) // componentModel = "spring" is a close equivalent of a @Component, can't use that annotation in interfaces so we use this.
public interface ListingMapper {

    @Mapping(source = "images", target = "imageUrls", qualifiedByName = "mapImagesToUrls")
    @Mapping(source = "images", target = "primaryImageUrl", qualifiedByName = "getPrimaryImageUrl")
    ListingResponseDto toResponseDTO(Listing listing);

    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "user", ignore = true)
    Listing toEntity(CreateListingRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(CreateListingRequest request, @MappingTarget Listing listing);

    @Named("getPrimaryImageUrl")
    default String getPrimaryImageUrl(List<ListingImage> images) {
        return images.stream()
                .filter(ListingImage::getIsPrimary)
                .map(ListingImage::getUrl)
                .findFirst()
                .orElse(null);
    }

    @Named("mapImagesToUrls")
    default List<String> mapImagesToUrls(List<ListingImage> images) {
        return images.stream()
                .map(ListingImage::getUrl)
                .toList();
    }

}
