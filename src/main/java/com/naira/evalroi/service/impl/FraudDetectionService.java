package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.listing.FraudDetectionResult;
import com.naira.evalroi.dto.listing.ParsedListingData;
import com.naira.evalroi.entity.City;
import com.naira.evalroi.entity.District;
import com.naira.evalroi.repository.CityRepository;
import com.naira.evalroi.repository.DistrictRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final DistrictRepository districtRepository;
    private final CityRepository cityRepository;

    public FraudDetectionResult analyzeRules(ParsedListingData data) {
        List<String> redFlags = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        int score = 100;

        // --- CRITICAL CHECKS ---

        if (data.getLivingAreaM2() != null && data.getSizeM2() != null
                && data.getLivingAreaM2() > data.getSizeM2()) {
            redFlags.add("Net alan (" + data.getLivingAreaM2() + "m²) brüt alandan (" + data.getSizeM2() + "m²) büyük olamaz");
            score -= 40;
        }

        if (data.getFloorNumber() != null && data.getTotalFloors() != null
                && data.getFloorNumber() > data.getTotalFloors()) {
            redFlags.add("Bulunduğu kat (" + data.getFloorNumber() + ") toplam kat sayısından (" + data.getTotalFloors() + ") büyük olamaz");
            score -= 40;
        }

        if (data.getBuildYear() != null && data.getBuildYear() > java.time.Year.now().getValue()) {
            redFlags.add("Yapım yılı (" + data.getBuildYear() + ") gelecekte bir tarih");
            score -= 30;
        }

        if (data.getPrice() == null || data.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            redFlags.add("Geçerli bir fiyat bilgisi yok");
            score -= 35;
        }

        if (data.getSizeM2() == null || data.getSizeM2() <= 0) {
            redFlags.add("Geçerli bir alan bilgisi yok");
            score -= 35;
        }

        // --- PRICE ANOMALY ---

        if (data.getPrice() != null && data.getSizeM2() != null && data.getSizeM2() > 0) {
            BigDecimal pricePerM2 = data.getPrice()
                    .divide(BigDecimal.valueOf(data.getSizeM2()), 2, RoundingMode.HALF_UP);

            BigDecimal avgPricePerM2 = getAvgPricePerM2(data.getDistrict(), data.getCity());

            if (avgPricePerM2 != null) {
                double ratio = pricePerM2.divide(avgPricePerM2, 4, RoundingMode.HALF_UP).doubleValue();

                if (ratio < 0.50) {
                    redFlags.add(String.format(
                            "Fiyat/m² (₺%s) bölge ortalamasının (₺%s) %%50'sinin altında — olası yem fiyatı",
                            pricePerM2.toPlainString(), avgPricePerM2.toPlainString()
                    ));
                    score -= 35;
                } else if (ratio < 0.70) {
                    warnings.add(String.format(
                            "Fiyat/m² (₺%s) bölge ortalamasının (₺%s) oldukça altında — dikkatli olun",
                            pricePerM2.toPlainString(), avgPricePerM2.toPlainString()
                    ));
                    score -= 15;
                } else if (ratio > 3.0) {
                    redFlags.add(String.format(
                            "Fiyat/m² (₺%s) bölge ortalamasının (₺%s) 3 katından fazla — şüpheli yüksek fiyat",
                            pricePerM2.toPlainString(), avgPricePerM2.toPlainString()
                    ));
                    score -= 20;
                }
            } else {
                warnings.add("Bu konum için piyasa verisi bulunamadı — fiyat karşılaştırması yapılamıyor");
                score -= 10;
            }
        }

        // --- WARNINGS ---

        if (data.getDistrict() == null || data.getCity() == null) {
            warnings.add("Konum bilgisi eksik — piyasa karşılaştırması yapılamıyor");
            score -= 10;
        }

        // --- FINAL SCORE & VERDICT ---

        score = Math.max(0, score);

        String verdict;
        if (score >= 80)      verdict = "LIKELY_GENUINE";
        else if (score >= 60) verdict = "NEEDS_REVIEW";
        else if (score >= 35) verdict = "SUSPICIOUS";
        else                  verdict = "LIKELY_FAKE";

        return new FraudDetectionResult(verdict, score, redFlags, warnings);
    }

    public BigDecimal getAvgPricePerM2(String districtName, String cityName) {
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
}
