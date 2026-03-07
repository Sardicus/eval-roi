package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ListingStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    SOLD("Sold");

    private final String displayName;
}
