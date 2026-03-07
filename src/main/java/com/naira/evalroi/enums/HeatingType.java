package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum HeatingType {
    KOMBI("Kombi"),
    CENTRAL_NATURAL_GAS("Central Natural Gas"),
    CENTRAL_COAL("Central Coal"),
    CENTRAL_ELECTRIC("Central Electric"),
    UNDERFLOOR("Underfloor"),     // Yerden ısıtmalı
    FLOOR_HEATER("Floor Heater"),   // Kat kaloriferi
    AIR_CONDITIONING("Air Conditioning"),
    STOVE_WOOD("Stove Wood"),
    STOVE_COAL("Stove Coal"),
    GEOTHERMAL("Geothermal"),
    NONE("None");

    private final String displayName;
}
