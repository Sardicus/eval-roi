package com.naira.evalroi.entity;

import com.naira.evalroi.enums.HeatingType;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "listings")
public class Listing extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private UserEntity user;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    private ListingStatus status;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    private Double sizeM2;
    private Double livingAreaM2;

    private Integer bedroomCount;
    private Integer bathroomCount;
    private Integer roomCount;
    private Integer floorNumber;
    private Integer totalFloors;
    private Integer buildYear;

    @Embedded
    private Address address;

    private Boolean hasParking;
    private Boolean hasElevator;
    private Boolean hasBalcony;
    private Boolean hasGarden;
    private Boolean isFurnished; // eşyalı

    @Enumerated(EnumType.STRING)
    private HeatingType heatingType;
}
