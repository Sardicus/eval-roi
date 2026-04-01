import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";
import AIAnalysisCard from "./AIAnalysisCard";
import { securedFetch } from "../utils/api";
import { useAuth } from '../hooks/useAuth.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

function ListingDetailPage() {
  usePageTitle("İlan Detayları");
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const { propertyTypes, heatingTypes, listingStatuses } = useEnums();
  const { user, logout, isLoggedIn } = useAuth();

  const canEdit = isLoggedIn && (
    user.userType === "ADMIN" ||
    (user.userType === "OWNER" && user.sub === listing.ownerIdentifier)
  );

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // securedFetch kullanarak 401 kontrolünü otomatiğe bağladık
        const response = await securedFetch(`http://localhost:8080/listing/get/${id}`);
        if (response && response.ok) {
          setListing(await response.json());
        } else if (response) {
          setError("İlan yüklenemedi.");
        }
      } catch {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await securedFetch("http://localhost:8080/buyer-profile/getAll");
        if (response && response.ok) {
          setProfiles(await response.json());
        }
      } catch {
        console.error("Profiller alınamadı");
      }
    };

    fetchListing();
    fetchProfiles();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] p-8 text-[#94a3b8]">Yükleniyor...</div>;
  if (error) return <div className="min-h-screen bg-[#0f172a] p-8 text-red-400">{error}</div>;
  if (!listing) return null;

  const cardClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6";
  const labelClass = "text-[#64748b]";
  const valueClass = "text-white font-medium";

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Geri Butonu */}
        <button
          onClick={() => navigate("/listings")}
          className="mb-6 text-[#94a3b8] hover:text-amber-400 transition-colors text-sm flex items-center gap-2"
        >
          ← İlanlara Dön
        </button>

        {/* Görsel Alanı */}
        <div className="relative h-80 bg-[#0f172a] rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-[#334155]">
          {listing.primaryImageUrl
            ? <>
              <img src={`http://localhost:8080${listing.primaryImageUrl}`} alt={listing.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
            </>
            : <span className="text-[#334155]">Görsel Yok</span>
          }
          <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${listing.status === "ACTIVE" ? "bg-emerald-900/80 text-emerald-400 border-emerald-400/20" :
            listing.status === "SOLD" ? "bg-gray-900/80 text-gray-400 border-gray-400/20" :
              "bg-amber-900/80 text-amber-400 border-amber-400/20"
            }`}>
            {listingStatuses[listing.status] || listing.status}
          </span>
        </div>

        {/* Başlık ve Fiyat */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{listing.title}</h1>
            <p className="text-[#94a3b8]">{listing.address.district}, {listing.address.city}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-amber-400">₺{listing.price.toLocaleString('tr-TR')}</p>
          </div>
        </div>

        {/* Önemli Bilgi Çubuğu */}
        <div className="grid grid-cols-5 gap-4 bg-[#1e293b] border border-[#334155] rounded-2xl p-4 mb-6 text-center">
          {[
            { value: listing.sizeM2, label: "m²" },
            { value: listing.bedroomCount ?? "-", label: "Yatak Odası" },
            { value: listing.bathroomCount ?? "-", label: "Banyo" },
            { value: listing.roomCount ?? "-", label: "Oda Sayısı" },
            { value: `${listing.floorNumber ?? "-"}/${listing.totalFloors ?? "-"}`, label: "Kat" },
          ].map(({ value, label }) => (
            <div key={label} className="border-r border-[#334155] last:border-0">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-[#94a3b8] text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Gayrimenkul Bilgileri */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Emlak Bilgileri</h2>
            <div className="space-y-3">
              {[
                { label: "Tip", value: propertyTypes[listing.propertyType] || listing.propertyType },
                { label: "Bina Yaşı", value: listing.buildYear ?? "-" },
                { label: "Net Alan", value: listing.livingAreaM2 ? `${listing.livingAreaM2} m²` : "-" },
                { label: "Isınma", value: heatingTypes[listing.heatingType] || listing.heatingType },
                { label: "Toplam Kat", value: listing.totalFloors ?? "-" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={valueClass}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Özellikler */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Özellikler</h2>
            <div className="space-y-3">
              {[
                { label: "Otopark", value: listing.hasParking },
                { label: "Asansör", value: listing.hasElevator },
                { label: "Balkon", value: listing.hasBalcony },
                { label: "Bahçe", value: listing.hasGarden },
                { label: "Eşyalı", value: listing.isFurnished },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={value ? "text-emerald-400 font-medium" : "text-red-400"}>
                    {value ? "✓ Evet" : "✗ Hayır"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Adres Bilgileri */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Adres</h2>
            <div className="space-y-3">
              {[
                { label: "Sokak/Cadde", value: listing.address.street },
                { label: "Mahalle", value: listing.address.neighborhood },
                { label: "İlçe", value: listing.address.district },
                { label: "Şehir", value: listing.address.city },
                { label: "Posta Kodu", value: listing.address.zipCode },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={valueClass}>{value || "-"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Açıklama */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Açıklama</h2>
            <p className="text-[#94a3b8] leading-relaxed">{listing.description || "Açıklama belirtilmedi."}</p>
          </div>

        </div>

        {/* AI Analiz Kartı */}
        <div className="mt-6">
          <AIAnalysisCard
            listingId={id}
            listing={listing}
            profiles={profiles}
          />
        </div>

        {/* İşlemler */}
        <div className="mt-6 flex gap-4">
          {canEdit && (
            <button
              onClick={() => navigate(`/edit-listing/${listing.id}`)}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
            >
              İlanı Düzenle
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ListingDetailPage;