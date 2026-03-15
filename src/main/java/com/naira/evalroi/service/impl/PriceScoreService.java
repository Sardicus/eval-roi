package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.entity.City;
import com.naira.evalroi.entity.District;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.repository.CityRepository;
import com.naira.evalroi.repository.DistrictRepository;
import com.naira.evalroi.service.ScoringStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PriceScoreService implements ScoringStrategy {

    private final DistrictRepository districtRepository;
    private final CityRepository cityRepository;

    @Override
    public String getCategoryName() {
        return "Price";
    }

    @Override
    public CategoryScoreDto calculateScore(Listing listing) {
        double total = calculatePriceScore(listing);

        return new CategoryScoreDto(
                getCategoryName(),
                total,
                100.0,
                getVerdict(total)
        );
    }

    private double calculatePriceScore(Listing listing) {
        if (listing.getPrice() == null || listing.getSizeM2() == null) return 50;

        BigDecimal pricePerM2 = listing.getPrice()
                .divide(BigDecimal.valueOf(listing.getSizeM2()), 2, RoundingMode.HALF_UP);

        BigDecimal avgPricePerM2 = getAvgPricePerM2(
                listing.getAddress().getDistrict(),
                listing.getAddress().getCity()
        );

        if (avgPricePerM2 == null) return 50;

        double ratio = pricePerM2.divide(avgPricePerM2, 4, RoundingMode.HALF_UP).doubleValue();

        if (ratio <= 0.70) return 100;
        if (ratio <= 0.80) return 85;
        if (ratio <= 0.90) return 70;
        if (ratio <= 1.00) return 55;
        if (ratio <= 1.10) return 40;
        if (ratio <= 1.20) return 25;
        return 10;
    }

    private BigDecimal getAvgPricePerM2(String districtName, String cityName) {
        if (districtName != null){
            Optional<District> district =  districtRepository.findByName(districtName);
            if (district.isPresent() && district.get().getAvgPricePerM2() != null) {
                return district.get().getAvgPricePerM2();
            }
        }

        if (cityName != null){
            Optional<City> city =  cityRepository.findByName(districtName);
            if (city.isPresent() && city.get().getAvgPricePerM2() != null) {
                return city.get().getAvgPricePerM2();
            }
        }

        return null;
    }

    private String getVerdict(double score) {
        if (score >= 85) return "Excellent - Well below market price";
        if (score >= 70) return "Good - Below market price";
        if (score >= 55) return "Fair - Around market price";
        if (score >= 40) return "Poor - Above market price";
        return "Critical - Significantly overpriced";
    }
}
