package com.naira.evalroi.dto.common;

public record AddressDto(
        String street,
        String city,
        String district,
        String neighborhood,
        String zipCode,
        Double latitude,
        Double longitude
) {}