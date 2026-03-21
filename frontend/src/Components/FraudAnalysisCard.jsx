import React, { useState } from "react";

const VERDICT_CONFIG = {
  LIKELY_GENUINE: { label: "Muhtemelen Gerçek", color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10", icon: "✓" },
  NEEDS_REVIEW:   { label: "İnceleme Gerekli",  color: "text-amber-400",   border: "border-amber-400/30",   bg: "bg-amber-400/10",   icon: "⚠" },
  SUSPICIOUS:     { label: "Şüpheli",            color: "text-orange-400",  border: "border-orange-400/30",  bg: "bg-orange-400/10",  icon: "⚠" },
  LIKELY_FAKE:    { label: "Muhtemelen Sahte",   color: "text-red-400",     border: "border-red-400/30",     bg: "bg-red-400/10",     icon: "✕" },
};

const FIELDS = [
  { key: "price",        label: "Fiyat (₺)",      type: "number" },
  { key: "sizeM2",       label: "Brüt Alan (m²)", type: "number" },
  { key: "livingAreaM2", label: "Net Alan (m²)",  type: "number" },
  { key: "floorNumber",  label: "Bulunduğu Kat",  type: "number" },
  { key: "totalFloors",  label: "Toplam Kat",     type: "number" },
  { key: "buildYear",    label: "Bina Yaşı",      type: "number" },
  { key: "district",     label: "İlçe",           type: "text"   },
  { key: "city",         label: "Şehir",          type: "text"   },
  { key: "description",  label: "Açıklama",       type: "text"   },
];

const STEPS = ["input", "review", "result"];

export default function FraudAnalysisCard({ headers }) {
  const [step, setStep]                     = useState("input");
  const [text, setText]                     = useState("");
  const [parsed, setParsed]                 = useState(null);
  const [result, setResult]                 = useState(null);
  const [parseLoading, setParseLoading]     = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [error, setError]                   = useState("");

  // Step 1 — parse raw text
  const handleParse = async () => {
    if (!text.trim()) return;
    setParseLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/fraud/parse", {
        method: "POST",
        headers: { ...headers, "Content-Type": "text/plain" },
        body: text.trim(),
      });
      if (response.ok) {
        setParsed(await response.json());
        setStep("review");
      } else {
        setError("Metin ayrıştırılamadı.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setParseLoading(false);
    }
  };

  // Step 2 — analyze parsed (possibly edited) data
  const handleAnalyze = async () => {
    setAnalyzeLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("http://localhost:8080/fraud/analyze", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (response.ok) {
        setResult(await response.json());
        setStep("result");
      } else {
        setError("Analiz başarısız oldu.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const updateField = (key, value) =>
    setParsed(prev => ({ ...prev, [key]: value === "" ? null : value }));

  const reset = () => {
    setStep("input");
    setText("");
    setParsed(null);
    setResult(null);
    setError("");
  };

  const verdict      = result ? (VERDICT_CONFIG[result.verdict] ?? VERDICT_CONFIG.NEEDS_REVIEW) : null;
  const currentIndex = STEPS.indexOf(step);

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center text-sm">
            🔍
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg leading-none">Sahtecilik Analizi</h2>
            <p className="text-[#64748b] text-sm mt-0.5">Sahibinden vb. ilan metnini yapıştırın, doğruluğunu analiz edelim</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s          ? "bg-amber-400 text-[#0f172a]" :
                currentIndex > i    ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" :
                                      "bg-[#334155] text-[#64748b]"
              }`}>
                {currentIndex > i ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${currentIndex > i ? "bg-emerald-400/40" : "bg-[#334155]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#334155] my-4" />

      {/* ── STEP 1: Paste raw text ── */}
      {step === "input" && (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="İlan metnini buraya yapıştırın..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-[#94a3b8] placeholder-[#475569] outline-none focus:border-amber-400 transition-colors text-sm resize-none font-mono leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[#475569] text-xs">{text.length} karakter</span>
            <button
              onClick={handleParse}
              disabled={!text.trim() || parseLoading}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
            >
              {parseLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin inline-block" />
                  Ayrıştırılıyor...
                </span>
              ) : "Devam Et →"}
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2: Review & edit parsed fields ── */}
      {step === "review" && parsed && (
        <>
          <p className="text-[#64748b] text-sm mb-4">
            Ayrıştırılan bilgileri kontrol edin, hatalı alanları düzeltin, ardından analiz edin.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {FIELDS.map(({ key, label, type }) => (
              <div key={key} className={key === "description" ? "col-span-2" : ""}>
                <label className="text-[#64748b] text-xs font-medium mb-1 block">{label}</label>
                <input
                  type={type}
                  value={parsed[key] ?? ""}
                  onChange={e => updateField(key, e.target.value)}
                  placeholder="—"
                  className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-white outline-none focus:border-amber-400 transition-colors text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep("input")}
              className="text-[#64748b] hover:text-amber-400 text-sm transition-colors"
            >
              ← Geri
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzeLoading}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
            >
              {analyzeLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin inline-block" />
                  Analiz ediliyor...
                </span>
              ) : "Analiz Et"}
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3: Result ── */}
      {step === "result" && result && verdict && (
        <>
          {/* Verdict + Score */}
          <div className={`flex items-center justify-between p-4 rounded-xl border mb-4 ${verdict.bg} ${verdict.border}`}>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-black ${verdict.color}`}>{verdict.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mb-0.5">Karar</p>
                <p className={`text-xl font-bold ${verdict.color}`}>{verdict.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mb-1">Özgünlük Skoru</p>
              <p className={`text-3xl font-black ${verdict.color}`}>{result.authenticityScore}</p>
              <div className="w-28 h-1.5 bg-[#0f172a] rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.authenticityScore >= 80 ? "bg-emerald-400" :
                    result.authenticityScore >= 60 ? "bg-amber-400"   :
                    result.authenticityScore >= 35 ? "bg-orange-400"  : "bg-red-400"
                  }`}
                  style={{ width: `${result.authenticityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Red flags */}
          {result.redFlags?.length > 0 && (
            <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-4 mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
                🚩 Kırmızı Bayraklar ({result.redFlags.length})
              </p>
              <ul className="space-y-2">
                {result.redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                    <span className="text-red-400 mt-0.5 shrink-0">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {result.warnings?.length > 0 && (
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
                ⚠ Uyarılar ({result.warnings.length})
              </p>
              <ul className="space-y-2">
                {result.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-300">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No issues */}
          {result.redFlags?.length === 0 && result.warnings?.length === 0 && (
            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-emerald-400">✓ Herhangi bir sorun tespit edilmedi.</p>
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => setStep("review")} className="text-[#64748b] hover:text-amber-400 text-sm transition-colors">
              ← Verileri düzenle
            </button>
            <button onClick={reset} className="text-[#64748b] hover:text-amber-400 text-sm transition-colors">
              Yeni ilan analiz et
            </button>
          </div>
        </>
      )}

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}