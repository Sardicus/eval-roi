package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum HouseholdType {
    SINGLE("Single"),
    COUPLE("Couple"),
    FAMILY_WITH_KIDS("Family with Kids"),
    RETIREE("Retiree");

    private final String displayName;
}
