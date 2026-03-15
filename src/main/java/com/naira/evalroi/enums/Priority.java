package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Priority {
    SAFETY_FIRST("Safety First"),
    VALUE_FOR_MONEY("Value for Money"),
    PREMIUM_COMFORT("Premium Comfort"),
    LOCATION_CONVENIENCE("Location Convenience");

    private final String displayName;
}
