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
        ScoreAccumulator acc = new ScoreAccumulator();

        if (listing.getPrice() == null || listing.getSizeM2() == null) {
            acc.add(50, "Price or size missing, default applied");
            return new CategoryScoreDto(getCategoryName(), acc.getScore(), 100.0, getVerdict(acc.getScore()), acc.getFactors());
        }

        BigDecimal pricePerM2 = listing.getPrice()
                .divide(BigDecimal.valueOf(listing.getSizeM2()), 2, RoundingMode.HALF_UP);

        BigDecimal avgPricePerM2 = getAvgPricePerM2(
                listing.getAddress().getDistrict(),
                listing.getAddress().getCity()
        );

        if (avgPricePerM2 == null) {
            acc.add(50, "No market data available for this location, default applied");
            return new CategoryScoreDto(getCategoryName(), acc.getScore(), 100.0, getVerdict(acc.getScore()), acc.getFactors());
        }

        double ratio = pricePerM2.divide(avgPricePerM2, 4, RoundingMode.HALF_UP).doubleValue();

        String priceContext = String.format(
                "Price/m²: ₺%s vs district average ₺%s (%.0f%% of market)",
                pricePerM2.toPlainString(),
                avgPricePerM2.toPlainString(),
                ratio * 100
        );

        if (ratio <= 0.70)      acc.add(100, priceContext + " — Excellent value");
        else if (ratio <= 0.80) acc.add(85,  priceContext + " — Below market");
        else if (ratio <= 0.90) acc.add(70,  priceContext + " — Slightly below market");
        else if (ratio <= 1.00) acc.add(55,  priceContext + " — Around market price");
        else if (ratio <= 1.10) acc.add(40,  priceContext + " — Slightly above market");
        else if (ratio <= 1.20) acc.add(25,  priceContext + " — Above market");
        else                    acc.add(10,  priceContext + " — Significantly overpriced");

        return new CategoryScoreDto(getCategoryName(), acc.getScore(), 100.0, getVerdict(acc.getScore()), acc.getFactors());
    }

    private BigDecimal getAvgPricePerM2(String districtName, String cityName) {
        if (districtName != null) {
            Optional<District> district = districtRepository.findByName(districtName);
            if (district.isPresent() && district.get().getAvgPricePerM2() != null) {
                return district.get().getAvgPricePerM2();
            }
        }
        if (cityName != null) {
            Optional<City> city = cityRepository.findByName(cityName);
            if (city.isPresent() && city.get().getAvgPricePerM2() != null) {
                return city.get().getAvgPricePerM2();
            }
        }
        return null;
    }

    @Override
    public String getVerdict(double score) {
        if (score >= 85) return "Excellent - Well below market price";
        if (score >= 70) return "Good - Below market price";
        if (score >= 55) return "Fair - Around market price";
        if (score >= 40) return "Poor - Above market price";
        return "Critical - Significantly overpriced";
    }
}