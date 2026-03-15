package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BudgetSensitivity {
    TIGHT("Tight Budget"),
    FLEXIBLE("Flexible"),
    NOT_A_CONCERN("Not a Concern");

    private final String displayName;
}

