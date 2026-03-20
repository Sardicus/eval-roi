package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.CategoryScoreDto;
import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.entity.BuyerProfile;
import com.naira.evalroi.entity.Listing;
import org.springframework.stereotype.Component;

@Component
public class EnhancedEvaluationPromptBuilder {

    public String buildSystemPrompt() {
        return """
                Sen profesyonel bir Türk gayrimenkul analistisin. Türkiye emlak piyasası, şehirler, ilçeler, deprem riskleri ve yaşam koşulları hakkında derin bilgiye sahipsin.
                Alıcı profiline ve değerlendirme skorlarına göre kişiselleştirilmiş, dürüst ve veriye dayalı tavsiyeler veriyorsun.
                Skorların alıcının önceliklerine göre ağırlıklandırıldığını biliyorsun — örneğin güvenlik öncelikli bir profil için bina güvenliği skoru daha fazla ağırlık taşır.
                Her zaman yalnızca geçerli JSON formatında yanıt veriyorsun — ekstra metin, markdown veya kod bloğu kullanmıyorsun.
                Yanıtlarını her zaman Türkçe veriyorsun.
                """;
    }

    public String buildUserPrompt(Listing listing, BuyerProfile profile, SimpleEvaluationDto simpleEval) {
        return """
                Aşağıdaki mülkü verilen alıcı profiline göre analiz et ve JSON formatında yanıt ver.
                
                MÜlk BİLGİLERİ:
                - Başlık: %s
                - Tür: %s
                - Konum: %s, %s
                - Fiyat: ₺%s
                - Brüt Alan: %sm², Net Alan: %sm²
                - Yatak Odası: %s, Banyo: %s, Oda Sayısı: %s
                - Kat: %s / %s
                - Yapım Yılı: %s
                - Isıtma: %s
                - Otopark: %s | Asansör: %s | Balkon: %s | Bahçe: %s | Eşyalı: %s
                
                DEĞERLENDIRME SKORLARI (Alıcı profiline göre ağırlıklandırılmış — toplam 100 üzerinden):
                %s
                
                ALICI PROFİLİ:
                - Profil Adı: %s
                - Hane Tipi: %s
                - Yaşam Tarzı: %s
                - Öncelik: %s
                - Bütçe Hassasiyeti: %s
                - Satın Alma Amacı: %s
                - Yaş Grubu: %s
                - Çocuk Var mı: %s
                - Evcil Hayvan Var mı: %s
                - Araç Var mı: %s
                - Engelli Birey Var mı: %s
                - Tadilat Kabul: %s
                - Minimum Alan: %s m²
                - Minimum Yatak Odası: %s
                - Maksimum Bütçe: %s
                - Ulaşım Önemi: %s
                
                Yalnızca şu JSON yapısıyla yanıt ver, başka hiçbir metin ekleme:
                {
                  "summary": "Bu mülkün 2-3 cümlelik genel değerlendirmesi",
                  "priceAnalysis": "Bu alıcının bütçesi ve amacına özel fiyat analizi",
                  "safetyAnalysis": "Alıcının özel durumuna göre güvenlik analizi",
                  "featuresAnalysis": "Alıcının ihtiyaçlarına göre özellik analizi",
                  "recommendation": "AL veya DÜŞÜN veya KAÇIN",
                  "recommendationReason": "Bu alıcıya özel 1-2 cümlelik gerekçe",
                  "confidence": "YÜKSEK veya ORTA veya DÜŞÜK",
                  "personalizedInsights": "Hane yapısı, yaşam tarzı ve önceliklere dayalı kişisel içgörüler"
                }
                """.formatted(
                listing.getTitle(),
                listing.getPropertyType().getDisplayName(),
                listing.getAddress().getDistrict(), listing.getAddress().getCity(),
                listing.getPrice().toPlainString(),
                listing.getSizeM2(), listing.getLivingAreaM2(),
                listing.getBedroomCount(), listing.getBathroomCount(), listing.getRoomCount(),
                listing.getFloorNumber(), listing.getTotalFloors(),
                listing.getBuildYear(),
                listing.getHeatingType().getDisplayName(),
                booleanToTurkish(listing.getHasParking()),
                booleanToTurkish(listing.getHasElevator()),
                booleanToTurkish(listing.getHasBalcony()),
                booleanToTurkish(listing.getHasGarden()),
                booleanToTurkish(listing.getIsFurnished()),
                buildScoresSummary(simpleEval),
                profile.getProfileName(),
                profile.getHouseholdType() != null ? profile.getHouseholdType().getDisplayName() : "Belirtilmemiş",
                profile.getLifestylePreference() != null ? profile.getLifestylePreference().getDisplayName() : "Belirtilmemiş",
                profile.getPriority() != null ? profile.getPriority().getDisplayName() : "Belirtilmemiş",
                profile.getBudgetSensitivity() != null ? profile.getBudgetSensitivity().getDisplayName() : "Belirtilmemiş",
                profile.getPurchaseIntent() != null ? profile.getPurchaseIntent().getDisplayName() : "Belirtilmemiş",
                profile.getAgeGroup() != null ? profile.getAgeGroup().getDisplayName() : "Belirtilmemiş",
                booleanToTurkish(profile.getHasChildren()),
                booleanToTurkish(profile.getHasPets()),
                booleanToTurkish(profile.getHasVehicle()),
                booleanToTurkish(profile.getHasDisabledMember()),
                booleanToTurkish(profile.getWillingToRenovate()),
                profile.getMinSizeM2() != null ? profile.getMinSizeM2() : "Belirtilmemiş",
                profile.getMinBedrooms() != null ? profile.getMinBedrooms() : "Belirtilmemiş",
                profile.getBudgetMax() != null ? "₺" + profile.getBudgetMax().toPlainString() : "Belirtilmemiş",
                profile.getCommuteImportance() != null ? profile.getCommuteImportance().getDisplayName() : "Belirtilmemiş"
        );
    }

    private String buildScoresSummary(SimpleEvaluationDto simpleEval) {
        StringBuilder sb = new StringBuilder();
        sb.append("- Genel Skor: %.1f/100 — %s%n".formatted(simpleEval.totalScore(), simpleEval.verdict()));
        for (CategoryScoreDto cat : simpleEval.categoryScores()) {
            sb.append("- %s: %.0f/100 — %s%n".formatted(cat.categoryName(), cat.score(), cat.verdict()));
            for (String factor : cat.factors()) {
                sb.append("  • %s%n".formatted(factor));
            }
        }
        return sb.toString();
    }

    private String booleanToTurkish(Boolean value) {
        if (value == null) return "Belirtilmemiş";
        return value ? "Evet" : "Hayır";
    }
}