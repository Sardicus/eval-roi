package com.naira.evalroi.dto.listing;

import com.naira.evalroi.dto.common.AddressDto;
import com.naira.evalroi.enums.HeatingType;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateListingRequest(
        @NotBlank String title,
        String description,
        @NotNull PropertyType propertyType,

        ListingStatus status,

        @NotNull BigDecimal price,

        @NotNull @Min(10) Double sizeM2,
        Double livingAreaM2,
        Integer bedroomCount,
        Integer bathroomCount,
        Integer roomCount,
        Integer floorNumber,
        Integer totalFloors,
        Integer buildYear,


        @NotNull AddressDto address,

        Boolean hasParking,
        Boolean hasElevator,
        Boolean hasBalcony,
        Boolean hasGarden,
        Boolean isFurnished,
        HeatingType heatingType
) {}
