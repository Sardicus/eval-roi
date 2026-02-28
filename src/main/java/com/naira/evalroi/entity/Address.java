package com.naira.evalroi.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class Address {
    private String zipCode;
    private Double latitude;     // enlem
    private Double longitude;    // boylam
    private String city;
    private String district;     // ilçe
    private String neighborhood; // mahalle
    private String street;
    private String buildingNumber;
    private String floor;
    private String apartmentNumber;
}