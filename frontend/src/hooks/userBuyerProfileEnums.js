import { useState, useEffect } from "react";

export function userBuyerProfileEnums() {
    const [enums, setEnums] = useState({
        householdType: {},
        lifestylePreference: {},
        priority: {},
        budgetSensitivity: {},
        purchaseIntent: {},
        ageGroup: {},
        commuteImportance: {}
    });

    useEffect(() => {
        fetch("http://localhost:8080/enums/buyer-profile-enums")
            .then(res => res.json())
            .then(data => {
                const turkishEnums = {
                    householdType: {
                        SINGLE: "Yalnız Yaşayan", //
                        COUPLE: "Çift", //
                        FAMILY_WITH_KIDS: "Çocuklu Aile", //
                        RETIREE: "Emekli" //
                    },
                    lifestylePreference: {
                        QUIET_RESIDENTIAL: "Sakin ve Yerleşim Odaklı", //
                        VIBRANT_SOCIAL: "Hareketli ve Sosyal", //
                        BALANCED: "Dengeli" //
                    },
                    priority: {
                        SAFETY: "Güvenlik",
                        PRICE: "Fiyat/Uygunluk",
                        FEATURES: "Özellikler/Lüks",
                        LOCATION: "Konum"
                    },
                    budgetSensitivity: {
                        TIGHT: "Kısıtlı Bütçe", //
                        FLEXIBLE: "Esnek", //
                        NOT_A_CONCERN: "Bütçe Sorunu Yok" //
                    },
                    purchaseIntent: {
                        RESIDENTIAL: "Oturum Amaçlı",
                        INVESTMENT: "Yatırım Amaçlı",
                        VACATION: "Yazlık/Tatil"
                    },
                    ageGroup: {
                        UNDER_30: "30 Yaş Altı", //
                        BETWEEN_30_50: "30-50 Yaş Arası", //
                        OVER_50: "50 Yaş Üstü" //
                    },
                    commuteImportance: {
                        LOW: "Düşük", //
                        MEDIUM: "Orta", //
                        HIGH: "Yüksek" //
                    }
                };
                setEnums(turkishEnums);
            })
            .catch(err => console.error("Alıcı profili enumları yüklenirken hata oluştu:", err));
    }, []);

    return enums;
}