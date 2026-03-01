package com.naira.evalroi.entity;

import com.naira.evalroi.enums.ClimateType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "cities")
public class City extends BaseEntity {

    private String name;

    @Enumerated(EnumType.STRING)
    private ClimateType climateType;

    @Column(precision = 15, scale = 2)
    private BigDecimal avgPricePerM2;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    private Country country;

    @OneToMany(mappedBy = "city")
    private List<District> districts;
}
