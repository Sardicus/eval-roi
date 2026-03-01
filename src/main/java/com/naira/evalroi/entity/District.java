package com.naira.evalroi.entity;

import com.naira.evalroi.enums.EarthquakeRiskZone;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "districts")
public class District extends BaseEntity{
    private String name;

    @Enumerated(EnumType.STRING)
    private EarthquakeRiskZone earthquakeRiskZone;

    @Column(precision = 15, scale = 2)
    private BigDecimal avgPricePerM2;

    @ManyToOne
    @JoinColumn(name = "city_id", referencedColumnName = "id", nullable = false)
    private City city;
}
