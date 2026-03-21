import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";
import WarningBox from "./WarningBox";

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { propertyTypes, heatingTypes, listingStatuses } = useEnums();

  // AI Analysis state
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { "Authorization": `Bearer ${token}` };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:8080/listing/get/${id}`, { headers });
        if (response.ok) setListing(await response.json());
        else setError("Failed to load listing.");
      } catch { setError("Could not connect to server."); }
      finally { setLoading(false); }
    };

    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:8080/buyer-profile/getAll", { headers });
        if (response.ok) setProfiles(await response.json());
      } catch { console.error("Failed to fetch profiles"); }
    };

    fetchListing();
    fetchProfiles();
  }, [id]);

  const handleAnalyze = async () => {
    if (!selectedProfileId) return;

    const profile = profiles.find(p => p.id === parseInt(selectedProfileId));
    const newWarnings = [];

    if (profile.minSizeM2 && listing.sizeM2 < profile.minSizeM2)
      newWarnings.push(`Size ${listing.sizeM2}m² is below your minimum of ${profile.minSizeM2}m²`);
    if (profile.minBedrooms && listing.bedroomCount < profile.minBedrooms)
      newWarnings.push(`${listing.bedroomCount} bedrooms is below your minimum of ${profile.minBedrooms}`);
    if (profile.budgetMax && listing.price > profile.budgetMax)
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
        `http://localhost:8080/evaluation/enhanced/${id}?profileId=${selectedProfileId}`,
        { headers }
      );
      if (response.ok) setAnalysis(await response.json());
      else setAnalysisError("Failed to get AI analysis.");
    } catch { setAnalysisError("Could not connect to server."); }
    finally { setAnalysisLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] p-8 text-[#94a3b8]">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#0f172a] p-8 text-red-400">{error}</div>;
  if (!listing) return null;

  const cardClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6";
  const labelClass = "text-[#64748b]";
  const valueClass = "text-white font-medium";

  const recommendationStyle = (rec) => {
    if (rec === "AL") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
    if (rec === "DÜŞÜN") return "bg-amber-400/10 text-amber-400 border-amber-400/30";
    if (rec === "KAÇIN") return "bg-red-400/10 text-red-400 border-red-400/30";
    // English fallback
    if (rec === "BUY") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
    if (rec === "CONSIDER") return "bg-amber-400/10 text-amber-400 border-amber-400/30";
    if (rec === "AVOID") return "bg-red-400/10 text-red-400 border-red-400/30";
    return "bg-[#334155] text-white border-[#334155]";
  };

  const confidenceStyle = (conf) => {
    if (conf === "YÜKSEK" || conf === "HIGH") return "text-emerald-400";
    if (conf === "ORTA" || conf === "MEDIUM") return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/listings")}
          className="mb-6 text-[#94a3b8] hover:text-amber-400 transition-colors text-sm flex items-center gap-2"
        >
          ← Back to Listings
        </button>

        {/* Image */}
        <div className="relative h-80 bg-[#0f172a] rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-[#334155]">
          {listing.primaryImageUrl
            ? <>
              <img src={`http://localhost:8080${listing.primaryImageUrl}`} alt={listing.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
            </>
            : <span className="text-[#334155]">No Image</span>
          }
          <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${listing.status === "ACTIVE" ? "bg-emerald-900/80 text-emerald-400 border-emerald-400/20" :
            listing.status === "SOLD" ? "bg-gray-900/80 text-gray-400 border-gray-400/20" :
              "bg-amber-900/80 text-amber-400 border-amber-400/20"
            }`}>
            {listingStatuses[listing.status] || listing.status}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{listing.title}</h1>
            <p className="text-[#94a3b8]">{listing.address.district}, {listing.address.city}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-amber-400">₺{listing.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Key Info Bar */}
        <div className="grid grid-cols-5 gap-4 bg-[#1e293b] border border-[#334155] rounded-2xl p-4 mb-6 text-center">
          {[
            { value: listing.sizeM2, label: "m²" },
            { value: listing.bedroomCount ?? "-", label: "Bedrooms" },
            { value: listing.bathroomCount ?? "-", label: "Bathrooms" },
            { value: listing.roomCount ?? "-", label: "Rooms" },
            { value: `${listing.floorNumber ?? "-"}/${listing.totalFloors ?? "-"}`, label: "Floor" },
          ].map(({ value, label }) => (
            <div key={label} className="border-r border-[#334155] last:border-0">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-[#94a3b8] text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Property Info */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Property Info</h2>
            <div className="space-y-3">
              {[
                { label: "Type", value: propertyTypes[listing.propertyType] || listing.propertyType },
                { label: "Build Year", value: listing.buildYear ?? "-" },
                { label: "Living Area", value: listing.livingAreaM2 ? `${listing.livingAreaM2} m²` : "-" },
                { label: "Heating", value: heatingTypes[listing.heatingType] || listing.heatingType },
                { label: "Total Floors", value: listing.totalFloors ?? "-" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={valueClass}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Features</h2>
            <div className="space-y-3">
              {[
                { label: "Parking", value: listing.hasParking },
                { label: "Elevator", value: listing.hasElevator },
                { label: "Balcony", value: listing.hasBalcony },
                { label: "Garden", value: listing.hasGarden },
                { label: "Furnished", value: listing.isFurnished },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={value ? "text-emerald-400 font-medium" : "text-red-400"}>
                    {value ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Address</h2>
            <div className="space-y-3">
              {[
                { label: "Street", value: listing.address.street },
                { label: "Neighborhood", value: listing.address.neighborhood },
                { label: "District", value: listing.address.district },
                { label: "City", value: listing.address.city },
                { label: "Zip Code", value: listing.address.zipCode },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={valueClass}>{value || "-"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Description</h2>
            <p className="text-[#94a3b8] leading-relaxed">{listing.description || "No description provided."}</p>
          </div>

        </div>

        {/* AI Analysis Section */}
        <div className="mt-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold text-lg">AI Analysis</h2>
                <p className="text-[#64748b] text-sm mt-0.5">Get a personalized property analysis based on your buyer profile</p>
              </div>
              {analysis && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${confidenceStyle(analysis.confidence)}`}>
                  Confidence: {analysis.confidence}
                </span>
              )}
            </div>

            {/* Profile selector + button */}
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

            {analysisLoading && (
              <div className="mt-6 flex items-center gap-3 text-[#94a3b8]">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Claude is analyzing this property for you...</span>
              </div>
            )}

            {/* Analysis Result */}
            {analysis && (
              <div className="mt-2">

                {/* Recommendation banner */}
                <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${recommendationStyle(analysis.recommendation)}`}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Recommendation for {analysis.profileName}</p>
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
                    { label: "💰 Price Analysis", value: analysis.priceAnalysis },
                    { label: "🏗️ Safety Analysis", value: analysis.safetyAnalysis },
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

                {/* Re-analyze button */}
                <button
                  onClick={() => { setAnalysis(null); setSelectedProfileId(""); }}
                  className="mt-4 text-[#64748b] hover:text-amber-400 text-sm transition-colors"
                >
                  ← Analyze with different profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/edit-listing/${listing.id}`)}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
          >
            Edit Listing
          </button>
        </div>

      </div>
    </div>
  );
}

export default ListingDetailPage;