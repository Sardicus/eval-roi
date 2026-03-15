package com.naira.evalroi.entity;

import com.naira.evalroi.enums.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "buyer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuyerProfile extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String profileName;

    @Enumerated(EnumType.STRING)
    private HouseholdType householdType;

    @Enumerated(EnumType.STRING)
    private LifestylePreference lifestylePreference;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private BudgetSensitivity budgetSensitivity;

    @Enumerated(EnumType.STRING)
    private PurchaseIntent purchaseIntent;

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;

    private Boolean hasChildren;
    private Boolean hasPets;
    private Boolean hasVehicle;
    private Boolean hasDisabledMember;
    private Boolean willingToRenovate;

    private Integer minSizeM2;
    private Integer minBedrooms;

    @Column(precision = 15, scale = 2)
    private BigDecimal budgetMax;

    @Enumerated(EnumType.STRING)
    private CommuteImportance commuteImportance;
}
