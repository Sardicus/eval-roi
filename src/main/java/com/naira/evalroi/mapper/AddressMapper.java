package com.naira.evalroi.mapper;

import com.naira.evalroi.dto.common.AddressDto;
import com.naira.evalroi.entity.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressDto toDto(Address address);
    Address toEntity(AddressDto addressDto);
}