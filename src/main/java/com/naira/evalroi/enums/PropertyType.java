package com.naira.evalroi.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PropertyType {
    APARTMENT("Apartment"),        // daire
    RESIDENCE("Residence"),        // rezidans
    VILLA("Villa"),
    DETACHED_HOUSE("Detached House"),   // müstakil ev
    DUPLEX("Duplex"),           // dubleks
    TRIPLEX("Triplex"),
    PENTHOUSE("Penhouse"),
    STUDIO("Studio"),

    LAND("Land"),             // arsa
    FIELD("Field"),            // tarla
    VINEYARD("Vineyard"),         // bağ & bahçe

    OFFICE("Office"),           // ofis
    SHOP("Shop"),             // dükkan
    WAREHOUSE("Warehouse"),        // depo
    HOTEL("Hotel"),
    PLAZA("Plaza"),

    BUILDING("Building"),         // tüm bina
    FARMHOUSE("Farmhouse");       // çiftlik evi

    private final String displayName;
}
