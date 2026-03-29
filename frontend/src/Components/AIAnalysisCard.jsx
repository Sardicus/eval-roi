import React, { useState } from "react";
import WarningBox from "./WarningBox";
import { securedFetch } from "../utils/api"; // Merkezi fetch aracını ekledik

const cardClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6";

// Öneri stili için yardımcı fonksiyon
const recommendationStyle = (rec) => {
  const r = rec?.toUpperCase();
  if (r === "AL" || r === "BUY")        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
  if (r === "DÜŞÜN" || r === "CONSIDER") return "bg-amber-400/10 text-amber-400 border-amber-400/30";
  if (r === "KAÇIN" || r === "AVOID")   return "bg-red-400/10 text-red-400 border-red-400/30";
  return "bg-[#334155] text-white border-[#334155]";
};

// Güven oranı stili için yardımcı fonksiyon
const confidenceStyle = (conf) => {
  const c = conf?.toUpperCase();
  if (c === "YÜKSEK" || c === "HIGH")   return "text-emerald-400 border-emerald-400/30";
  if (c === "ORTA"   || c === "MEDIUM") return "text-amber-400 border-amber-400/30";
  return "text-red-400 border-red-400/30";
};

// Güven oranı metni çevirisi
const translateConfidence = (conf) => {
  const c = conf?.toUpperCase();
  if (c === "HIGH") return "YÜKSEK";
  if (c === "MEDIUM") return "ORTA";
  if (c === "LOW") return "DÜŞÜK";
  return conf;
};

export default function AIAnalysisCard({ listingId, listing, profiles }) {
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [analysis, setAnalysis]                   = useState(null);
  const [analysisLoading, setAnalysisLoading]     = useState(false);
  const [analysisError, setAnalysisError]         = useState("");
  const [warnings, setWarnings]                   = useState([]);
  const [showWarning, setShowWarning]             = useState(false);

  const handleAnalyze = async () => {
    if (!selectedProfileId) return;

    const profile = profiles.find(p => p.id === parseInt(selectedProfileId));
    const newWarnings = [];

    // Profil kriterleri ile ilan özelliklerini karşılaştır (Uyarılar)
    if (profile.minSizeM2 && listing.sizeM2 < profile.minSizeM2)
      newWarnings.push(`İlan alanı (${listing.sizeM2}m²), profilinizdeki minimum ${profile.minSizeM2}m² sınırının altında.`);
    
    if (profile.minBedrooms && listing.bedroomCount < profile.minBedrooms)
      newWarnings.push(`Yatak odası sayısı (${listing.bedroomCount}), minimum ${profile.minBedrooms} beklentinizin altında.`);
    
    if (profile.budgetMax && listing.price > profile.budgetMax)
      newWarnings.push(`Fiyat (₺${listing.price.toLocaleString()}), ₺${Number(profile.budgetMax).toLocaleString()} tutarındaki bütçenizi aşıyor.`);

    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      setShowWarning(true);
      return;
    }

    await runAnalysis();
  };

  const runAnalysis = async () => {
    setShowWarning(false);
    setWarnings([]);
    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysis(null);
    try {
      // securedFetch ile 401 kontrolü otomatik yapılır
      const response = await securedFetch(
        `http://localhost:8080/evaluation/enhanced/${listingId}?profileId=${selectedProfileId}`
      );
      
      if (response && response.ok) {
        setAnalysis(await response.json());
      } else if (response) {
        setAnalysisError("Yapay zeka analizi alınamadı.");
      }
    } catch {
      setAnalysisError("Sunucuya bağlanılamadı.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setSelectedProfileId("");
    setAnalysisError("");
  };

  return (
    <div className={cardClass}>
      {/* Başlık Bölümü */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Yapay Zeka Analizi</h2>
          <p className="text-[#64748b] text-sm mt-0.5">
            Alıcı profilinize göre kişiselleştirilmiş gayrimenkul analizini alın
          </p>
        </div>
        {analysis && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${confidenceStyle(analysis.confidence)}`}>
            Güven Oranı: {translateConfidence(analysis.confidence)}
          </span>
        )}
      </div>

      {/* Profil Seçici */}
      {!analysis && (
        <div className="flex gap-3 items-center">
          <select
            value={selectedProfileId}
            onChange={e => setSelectedProfileId(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-white outline-none focus:border-amber-400 transition-colors text-sm"
          >
            <option value="">Bir alıcı profili seçin...</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.profileName}</option>
            ))}
          </select>
          <button
            onClick={handleAnalyze}
            disabled={!selectedProfileId || analysisLoading}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f172a] font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            {analysisLoading ? "Analiz Ediliyor..." : "Analiz Et"}
          </button>
        </div>
      )}

      {/* Uyarı Kutusu */}
      {showWarning && (
        <div className="mt-4">
          <WarningBox
            warnings={warnings}
            onConfirm={runAnalysis}
            onCancel={() => { setShowWarning(false); setWarnings([]); }}
            confirmLabel="Yine de Analiz Et"
          />
        </div>
      )}

      {analysisError && <p className="text-red-400 text-sm mt-3">{analysisError}</p>}

      {/* Yükleme Ekranı */}
      {analysisLoading && (
        <div className="mt-6 flex items-center gap-3 text-[#94a3b8]">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Claude bu mülkü sizin için analiz ediyor...</span>
        </div>
      )}

      {/* Analiz Sonucu */}
      {analysis && (
        <div className="mt-2">

          {/* Öneri Özeti */}
          <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${recommendationStyle(analysis.recommendation)}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
                {analysis.profileName} profili için öneri
              </p>
              <p className="text-2xl font-bold">{analysis.recommendation}</p>
            </div>
            <p className="text-sm max-w-sm text-right opacity-90">{analysis.recommendationReason}</p>
          </div>

          {/* Genel Özet */}
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mb-2">Özet Analiz</p>
            <p className="text-[#94a3b8] leading-relaxed text-sm">{analysis.summary}</p>
          </div>

          {/* Detaylı Analiz Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: "💰 Fiyat Analizi",     value: analysis.priceAnalysis },
              { label: "🏗️ Güvenlik Analizi",  value: analysis.safetyAnalysis },
              { label: "✨ Özellik Analizi",   value: analysis.featuresAnalysis },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0f172a] border border-[#334155] rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mb-2">{label}</p>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          {/* Kişiselleştirilmiş İpuçları */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Kişiselleştirilmiş Detaylar</p>
            <p className="text-[#94a3b8] text-sm leading-relaxed">{analysis.personalizedInsights}</p>
          </div>

          {/* Yeniden Analiz Et */}
          <button
            onClick={reset}
            className="mt-4 text-[#64748b] hover:text-amber-400 text-sm transition-colors"
          >
            ← Farklı bir profil ile analiz et
          </button>
        </div>
      )}
    </div>
  );
}