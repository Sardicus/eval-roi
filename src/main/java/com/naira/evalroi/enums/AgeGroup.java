package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AgeGroup {
    UNDER_30("Under 30"),
    BETWEEN_30_50("30-50"),
    OVER_50("Over 50");

    private final String displayName;
}
