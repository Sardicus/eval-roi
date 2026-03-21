import React, { useState } from "react";
import WarningBox from "./WarningBox";

const cardClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6";

const recommendationStyle = (rec) => {
  if (rec === "AL" || rec === "BUY")      return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
  if (rec === "DÜŞÜN" || rec === "CONSIDER") return "bg-amber-400/10 text-amber-400 border-amber-400/30";
  if (rec === "KAÇIN" || rec === "AVOID") return "bg-red-400/10 text-red-400 border-red-400/30";
  return "bg-[#334155] text-white border-[#334155]";
};

const confidenceStyle = (conf) => {
  if (conf === "YÜKSEK" || conf === "HIGH")   return "text-emerald-400";
  if (conf === "ORTA"   || conf === "MEDIUM") return "text-amber-400";
  return "text-red-400";
};

export default function AIAnalysisCard({ listingId, listing, profiles, headers }) {
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [analysis, setAnalysis]                   = useState(null);
  const [analysisLoading, setAnalysisLoading]     = useState(false);
  const [analysisError, setAnalysisError]         = useState("");
  const [warnings, setWarnings]                   = useState([]);
  const [showWarning, setShowWarning]             = useState(false);

  const handleAnalyze = async () => {
    if (!selectedProfileId) return;

    const profile     = profiles.find(p => p.id === parseInt(selectedProfileId));
    const newWarnings = [];

    if (profile.minSizeM2   && listing.sizeM2       < profile.minSizeM2)
      newWarnings.push(`Size ${listing.sizeM2}m² is below your minimum of ${profile.minSizeM2}m²`);
    if (profile.minBedrooms && listing.bedroomCount  < profile.minBedrooms)
      newWarnings.push(`${listing.bedroomCount} bedrooms is below your minimum of ${profile.minBedrooms}`);
    if (profile.budgetMax   && listing.price         > profile.budgetMax)
      newWarnings.push(`Price ₺${listing.price.toLocaleString()} exceeds your budget of ₺${Number(profile.budgetMax).toLocaleString()}`);

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
      const response = await fetch(
        `http://localhost:8080/evaluation/enhanced/${listingId}?profileId=${selectedProfileId}`,
        { headers }
      );
      if (response.ok) setAnalysis(await response.json());
      else setAnalysisError("Failed to get AI analysis.");
    } catch {
      setAnalysisError("Could not connect to server.");
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">AI Analysis</h2>
          <p className="text-[#64748b] text-sm mt-0.5">
            Get a personalized property analysis based on your buyer profile
          </p>
        </div>
        {analysis && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${confidenceStyle(analysis.confidence)}`}>
            Confidence: {analysis.confidence}
          </span>
        )}
      </div>

      {/* Profile selector */}
      {!analysis && (
        <div className="flex gap-3 items-center">
          <select
            value={selectedProfileId}
            onChange={e => setSelectedProfileId(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-white outline-none focus:border-amber-400 transition-colors text-sm"
          >
            <option value="">Select a buyer profile...</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.profileName}</option>
            ))}
          </select>
          <button
            onClick={handleAnalyze}
            disabled={!selectedProfileId || analysisLoading}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f172a] font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            {analysisLoading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      )}

      {/* Warning box */}
      {showWarning && (
        <div className="mt-4">
          <WarningBox
            warnings={warnings}
            onConfirm={runAnalysis}
            onCancel={() => { setShowWarning(false); setWarnings([]); }}
            confirmLabel="Analyze Anyway"
          />
        </div>
      )}

      {analysisError && <p className="text-red-400 text-sm mt-3">{analysisError}</p>}

      {/* Loading */}
      {analysisLoading && (
        <div className="mt-6 flex items-center gap-3 text-[#94a3b8]">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Claude is analyzing this property for you...</span>
        </div>
      )}

      {/* Result */}
      {analysis && (
        <div className="mt-2">

          {/* Recommendation banner */}
          <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${recommendationStyle(analysis.recommendation)}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
                Recommendation for {analysis.profileName}
              </p>
              <p className="text-2xl font-bold">{analysis.recommendation}</p>
            </div>
            <p className="text-sm max-w-sm text-right opacity-90">{analysis.recommendationReason}</p>
          </div>

          {/* Summary */}
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mb-2">Summary</p>
            <p className="text-[#94a3b8] leading-relaxed text-sm">{analysis.summary}</p>
          </div>

          {/* Analysis cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: "💰 Price Analysis",    value: analysis.priceAnalysis },
              { label: "🏗️ Safety Analysis",   value: analysis.safetyAnalysis },
              { label: "✨ Features Analysis", value: analysis.featuresAnalysis },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0f172a] border border-[#334155] rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mb-2">{label}</p>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          {/* Personalized insights */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Personalized Insights</p>
            <p className="text-[#94a3b8] text-sm leading-relaxed">{analysis.personalizedInsights}</p>
          </div>

          {/* Re-analyze */}
          <button
            onClick={reset}
            className="mt-4 text-[#64748b] hover:text-amber-400 text-sm transition-colors"
          >
            ← Analyze with different profile
          </button>
        </div>
      )}
    </div>
  );
}