import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";
import { securedFetch } from "../utils/api"; // Merkezi fetch aracını ekledik

function AddListingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { propertyTypes, heatingTypes, listingStatuses } = useEnums();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "APARTMENT",
    status: "ACTIVE",
    price: "",
    sizeM2: "",
    livingAreaM2: "",
    bedroomCount: "",
    bathroomCount: "",
    roomCount: "",
    floorNumber: "",
    totalFloors: "",
    buildYear: "",
    hasParking: false,
    hasElevator: false,
    hasBalcony: false,
    hasGarden: false,
    isFurnished: false,
    heatingType: "KOMBI",
    address: {
      street: "", city: "", district: "", neighborhood: "",
      zipCode: "", latitude: "", longitude: "",
      buildingNumber: "", floor: "", apartmentNumber: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, address: { ...formData.address, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await securedFetch("http://localhost:8080/listing/create", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          sizeM2: parseFloat(formData.sizeM2),
          livingAreaM2: formData.livingAreaM2 ? parseFloat(formData.livingAreaM2) : null,
          bedroomCount: formData.bedroomCount ? parseInt(formData.bedroomCount) : null,
          bathroomCount: formData.bathroomCount ? parseInt(formData.bathroomCount) : null,
          roomCount: formData.roomCount ? parseInt(formData.roomCount) : null,
          floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
          totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
          buildYear: formData.buildYear ? parseInt(formData.buildYear) : null,
          address: {
            ...formData.address,
            latitude: formData.address.latitude ? parseFloat(formData.address.latitude) : null,
            longitude: formData.address.longitude ? parseFloat(formData.address.longitude) : null,
          },
        }),
      });

      if (response && response.ok) {
        navigate("/listings");
      } else if (response) {
        const data = await response.json();
        setError(data.message || "İlan oluşturulamadı.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  // Stil Tanımlamaları
  const inputClass = "w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] outline-none focus:border-amber-400 transition-colors";
  const labelClass = "block text-sm font-medium text-[#94a3b8] mb-1";
  const sectionClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6 space-y-4";
  const sectionTitle = "text-white font-semibold text-lg mb-2";

  // Checkbox etiketleri için çeviri sözlüğü
  const featureLabels = {
    hasParking: "Otopark Var",
    hasElevator: "Asansör Var",
    hasBalcony: "Balkon Var",
    hasGarden: "Bahçeli",
    isFurnished: "Eşyalı"
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Başlık ve Geri Butonu */}
        <button onClick={() => navigate("/listings")} className="mb-6 text-[#94a3b8] hover:text-amber-400 transition-colors text-sm">
          ← İlanlara Dön
        </button>
        <h1 className="text-2xl font-bold text-white mb-6">Yeni İlan Ekle</h1>

        {error && <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Temel Bilgiler */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Temel Bilgiler</h2>
            <div>
              <label className={labelClass}>Başlık *</label>
              <input name="title" required className={inputClass} value={formData.title} onChange={handleChange} placeholder="Örn: Beşiktaş'ta Satılık Daire" />
            </div>
            <div>
              <label className={labelClass}>Açıklama</label>
              <textarea name="description" rows={3} className={inputClass} value={formData.description} onChange={handleChange} placeholder="İlan detaylarını yazınız..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Emlak Tipi *</label>
                <select name="propertyType" required className={inputClass} value={formData.propertyType} onChange={handleChange}>
                  {Object.entries(propertyTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Durum</label>
                <select name="status" className={inputClass} value={formData.status} onChange={handleChange}>
                  {Object.entries(listingStatuses).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detaylar */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Özellikler & Detaylar</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Fiyat *", name: "price", required: true },
                { label: "Brüt Alan (m²) *", name: "sizeM2", required: true },
                { label: "Net Alan (m²)", name: "livingAreaM2" },
                { label: "Yatak Odası", name: "bedroomCount" },
                { label: "Banyo Sayısı", name: "bathroomCount" },
                { label: "Oda Sayısı", name: "roomCount" },
                { label: "Bulunduğu Kat", name: "floorNumber" },
                { label: "Toplam Kat", name: "totalFloors" },
                { label: "Bina Yaşı", name: "buildYear" },
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input name={name} type="number" required={required} className={inputClass}
                    value={formData[name]} onChange={handleChange} />
                </div>
              ))}
              <div>
                <label className={labelClass}>Isınma Tipi</label>
                <select name="heatingType" className={inputClass} value={formData.heatingType} onChange={handleChange}>
                  {Object.entries(heatingTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ek Özellikler */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <h2 className={sectionTitle}>Ekstralar</h2>
            <div className="grid grid-cols-3 gap-4">
              {["hasParking", "hasElevator", "hasBalcony", "hasGarden", "isFurnished"].map((feature) => (
                <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    formData[feature] ? "bg-amber-400 border-amber-400" : "border-[#334155] bg-[#0f172a]"
                  }`}>
                    {formData[feature] && <span className="text-[#0f172a] text-xs font-bold">✓</span>}
                  </div>
                  <input type="checkbox" name={feature} checked={formData[feature]} onChange={handleChange} className="hidden" />
                  <span className="text-[#94a3b8] text-sm group-hover:text-white transition-colors">
                    {featureLabels[feature]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Adres */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Adres Bilgileri</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Şehir", name: "city" },
                { label: "İlçe", name: "district" },
                { label: "Mahalle", name: "neighborhood" },
                { label: "Sokak/Cadde", name: "street" },
                { label: "Bina No", name: "buildingNumber" },
                { label: "Kat", name: "floor" },
                { label: "Daire No", name: "apartmentNumber" },
                { label: "Posta Kodu", name: "zipCode" },
                { label: "Enlem (Lat)", name: "latitude", type: "number" },
                { label: "Boylam (Lon)", name: "longitude", type: "number" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input name={name} type={type || "text"} className={inputClass}
                    value={formData.address[name]} onChange={handleAddressChange} />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm tracking-wide">
            İlanı Oluştur
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddListingPage;