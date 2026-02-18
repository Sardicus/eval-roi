package com.naira.evalroi.dto.listing;

import com.naira.evalroi.dto.common.AddressDto;
import com.naira.evalroi.enums.HeatingType;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;

import java.math.BigDecimal;
import java.util.List;

public record ListingResponseDto(
        List<String> imageUrls,
        String primaryImageUrl,
        String title,
        String description,
        PropertyType propertyType,

        ListingStatus status,

        BigDecimal price,

        Double sizeM2,
        Double livingAreaM2,
        Integer bedroomCount,
        Integer bathroomCount,
        Integer roomCount,
        Integer floorNumber,
        Integer totalFloors,
        Integer buildYear,

        AddressDto address,

        Boolean hasParking,
        Boolean hasElevator,
        Boolean hasBalcony,
        Boolean hasGarden,
        Boolean isFurnished,
        HeatingType heatingType
) {}