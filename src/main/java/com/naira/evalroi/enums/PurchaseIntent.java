package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PurchaseIntent {
    BUYING("Buying"),
    RENTING("Renting"),
    INVESTING("Investing");

    private final String displayName;
}
