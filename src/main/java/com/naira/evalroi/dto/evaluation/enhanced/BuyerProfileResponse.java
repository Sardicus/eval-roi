package com.naira.evalroi.dto.evaluation.enhanced;

import com.naira.evalroi.enums.*;

import java.math.BigDecimal;

public record BuyerProfileResponse(
        Integer id,
        String profileName,
        HouseholdType householdType,
        LifestylePreference lifestylePreference,
        Priority priority,
        BudgetSensitivity budgetSensitivity,
        PurchaseIntent purchaseIntent,
        AgeGroup ageGroup,
        Boolean hasChildren,
        Boolean hasPets,
        Boolean hasVehicle,
        Boolean hasDisabledMember,
        Boolean willingToRenovate,
        Integer minSizeM2,
        Integer minBedrooms,
        BigDecimal budgetMax,
        CommuteImportance commuteImportance
) {}