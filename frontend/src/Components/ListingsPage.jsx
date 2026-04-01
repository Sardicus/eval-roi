import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEnums } from "../hooks/useEnums";
import { securedFetch } from "../utils/api";
import ListingFilter from "./ListingFilter";
import { useAuth } from '../hooks/useAuth.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

function ListingsPage() {
  usePageTitle("İlanlar");
  const [listingsPage, setListingsPage] = useState({ content: [] });
  const [error, setError] = useState("");
  const { propertyTypes } = useEnums();
  const { user, logout, isLoggedIn } = useAuth();
  const canEdit = isLoggedIn && (
    user.userType === "ADMIN" ||
    (user.userType === "OWNER" && user.sub === listing.ownerIdentifier)
  );


  const [filters, setFilters] = useState({
    title: "",
    city: "",
    propertyType: "",
    status: "",
    minPrice: "",
    maxPrice: ""
  });
  const [page, setPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const categoryTranslations = {
    "Building Safety": "Bina Güvenliği",
    "Features": "Özellikler",
    "Price": "Fiyat",
    "Location": "Konum" // Eğer varsa diğerlerini de ekleyebilirsin
  };


  const navigate = useNavigate();

  const fetchListings = async (pageNumber = 0) => {
    try {
      const token = localStorage.getItem("token");
      const queryObj = { page: pageNumber, size: 10 };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          let parsedValue;

          if (key === "minPrice" || key === "maxPrice") {
            parsedValue = String(value).replace(/\./g, "");
          } else if (key === "status" && value === "undefined") {
            return;
          } else if (key === "propertyType" && Array.isArray(value)) {
            parsedValue = value.length ? value.join(",") : null;
            if (!parsedValue) return;
          } else {
            parsedValue = value;
          }

          queryObj[key] = parsedValue;
        }
      });

      const query = new URLSearchParams(queryObj).toString();

      const response = await securedFetch(`http://localhost:8080/listing/getAllListings?${query}`);

      if (response.ok) {
        const data = await response.json();
        setListingsPage(data);
        setPage(pageNumber);
      } else {
        setError("İlanlar yüklenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      setError("Sunucuya bağlanılamadı.");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;

    try {
      const response = await securedFetch(`http://localhost:8080/listing/delete/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setListingsPage((prev) => ({
          ...prev,
          content: prev.content.filter((l) => l.id !== id),
        }));
      } else {
        setError("İlan silinemedi.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const handleStatusChange = async (e, id, newStatus) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/listing/updateListingStatus/${id}?status=${newStatus}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setListingsPage((prev) => ({
          ...prev,
          content: prev.content.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
        }));
      } else {
        setError("Durum güncellenemedi.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const verdictColor = (verdict) => {
    if (verdict === "Excellent") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (verdict === "Good") return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    if (verdict === "Fair") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  const translateVerdict = (verdict) => {
    const translations = {
      'Excellent': 'Mükemmel',
      'Good': 'İyi',
      'Fair': 'Orta',
      'Poor': 'Zayıf'
    };
    return translations[verdict] || verdict;
  };

  const barColor = (ratio) => {
    if (ratio >= 0.8) return "bg-emerald-400";
    if (ratio >= 0.6) return "bg-cyan-400";
    if (ratio >= 0.4) return "bg-amber-400";
    return "bg-red-400";
  };

  const getActiveFilterCount = () => {
    let count = 0;

    if (filters.title.trim()) count++;
    if (filters.city.trim()) count++;
    if (filters.status) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.propertyType && filters.propertyType.length > 0) {
      count += filters.propertyType.length;
    }

    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      {/* Başlık Bölümü */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">İlanlar</h1>
          <p className="text-[#64748b] text-sm mt-1">{listingsPage.totalElements || 0} ilan bulundu</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilter(prev => !prev)}
            // relative sınıfı rozetin konumlanması için kritik
            className="relative px-4 py-2 bg-[#1e293b] text-white rounded-lg border border-[#334155] hover:border-amber-400/40 transition-all flex items-center gap-2"
          >
            {/* Filtre İkonu */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>

            Filtreler

            {/* Aktif Filtre Sayısı Rozeti */}
            {activeCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-[#0f172a] shadow-lg border-2 border-[#0f172a] animate-in zoom-in">
                {activeCount}
              </span>
            )}
          </button>
          {canEdit && (
            <button
              onClick={() => navigate("/add-listing")}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm shadow-lg shadow-amber-400/10"
            >
              + İlan Ekle
            </button>)}
        </div>
      </div>

      {/* Filtre Paneli */}
      {showFilter && (
        <ListingFilter
          filters={filters}
          setFilters={setFilters}
          onApply={() => {
            fetchListings(0);
            setShowFilter(false);
          }}
        />
      )}

      {error && (
        <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">{error}</p>
      )}

      {/* İlan Listesi Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listingsPage.content.map((listing) => (
          <div
            key={listing.id}
            onClick={() => navigate(`/listing/${listing.id}`)}
            className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/40 transition-all hover:shadow-lg hover:shadow-amber-400/5 group"
          >
            {/* Resim */}
            <div className="relative h-48 bg-[#0f172a] flex items-center justify-center overflow-hidden">
              {listing.primaryImageUrl ? (
                <>
                  <img
                    src={`http://localhost:8080${listing.primaryImageUrl}`}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-60" />
                </>
              ) : (
                <span className="text-[#334155] text-sm">Resim Yok</span>
              )}
              <span
                className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${listing.status === "ACTIVE"
                  ? "bg-emerald-900/80 text-emerald-400 border-emerald-400/20"
                  : listing.status === "SOLD"
                    ? "bg-gray-900/80 text-gray-400 border-gray-400/20"
                    : "bg-amber-900/80 text-amber-400 border-amber-400/20"
                  }`}
              >
                {listing.status === "ACTIVE" ? "AKTİF" : listing.status === "SOLD" ? "SATILDI" : "PASİF"}
              </span>
            </div>

            {/* İçerik */}
            <div className="p-5">
              <h2 className="text-white font-semibold text-lg mb-1 truncate">{listing.title}</h2>
              <p className="text-[#94a3b8] text-sm mb-1">{listing.address.district}, {listing.address.city}</p>
              <p className="text-[#94a3b8] text-sm mb-3">
                {propertyTypes[listing.propertyType] || listing.propertyType} · {listing.sizeM2}m²{" "}
                {listing.bedroomCount ? `· ${listing.bedroomCount} Oda` : ""}
              </p>
              <p className="text-amber-400 font-bold text-xl mb-4">
                ₺{listing.price.toLocaleString('tr-TR')}
              </p>

              {/* Değerlendirme */}
              {listing.simpleEvaluationSummary && (
                <div className="pt-4 border-t border-[#334155]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">
                      Değerlendirme Puanı
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${verdictColor(
                          listing.simpleEvaluationSummary.verdict
                        )}`}
                      >
                        {translateVerdict(listing.simpleEvaluationSummary.verdict)}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {listing.simpleEvaluationSummary.totalScore}/
                        {listing.simpleEvaluationSummary.maxTotalScore}
                      </span>
                    </div>
                  </div>
                  {listing.simpleEvaluationSummary.categoryScores.map((cat) => (
                    <div key={cat.categoryName} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        {/* Burada sözlükten karşılığını alıyoruz, yoksa orijinalini basıyoruz */}
                        <span className="text-[#94a3b8]">
                          {categoryTranslations[cat.categoryName] || cat.categoryName}
                        </span>
                        <span className="text-white font-medium">
                          {cat.score}/{cat.maxScore}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#334155] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor(
                            cat.score / cat.maxScore
                          )}`}
                          style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* İşlemler */}
              {canEdit && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#334155]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-listing/${listing.id}`);
                    }}
                    className="px-3 py-1.5 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white hover:border-amber-400/40 rounded-lg text-xs font-medium transition-all"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={(e) => handleStatusChange(e, listing.id, listing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${listing.status === "ACTIVE"
                      ? "bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                      : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20"
                      }`}
                  >
                    {listing.status === "ACTIVE" ? "Pasife Al" : "Yayına Al"}
                  </button>
                  {listing.status !== "SOLD" && (
                    <button
                      onClick={(e) => handleStatusChange(e, listing.id, "SOLD")}
                      className="px-3 py-1.5 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white rounded-lg text-xs font-medium transition-all"
                    >
                      Satıldı İşaretle
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, listing.id)}
                    className="px-3 py-1.5 bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 rounded-lg text-xs font-medium transition-all"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sayfalama */}
      {listingsPage.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: listingsPage.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchListings(i)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${page === i
                ? "bg-amber-400 text-[#0f172a] border-amber-400 font-bold"
                : "bg-[#1e293b] text-white border-[#334155] hover:border-amber-400/40"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListingsPage;