package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CommuteImportance {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High");

    private final String displayName;
}