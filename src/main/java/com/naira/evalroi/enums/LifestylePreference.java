package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum LifestylePreference {
    QUIET_RESIDENTIAL("Quiet & Residential"),
    VIBRANT_SOCIAL("Vibrant & Social"),
    BALANCED("Balanced");

    private final String displayName;
}
