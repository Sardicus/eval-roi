package com.naira.evalroi.mapper;

import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileRequest;
import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileResponse;
import com.naira.evalroi.entity.BuyerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BuyerProfileMapper {

    BuyerProfileResponse toResponse(BuyerProfile profile);

    BuyerProfile toEntity(BuyerProfileRequest request);

    void updateEntityFromRequest(BuyerProfileRequest request, @MappingTarget BuyerProfile profile);
}
