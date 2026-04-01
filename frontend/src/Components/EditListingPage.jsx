import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";
import { usePageTitle } from '../hooks/usePageTitle.js';

function EditListingPage() {
  usePageTitle("İlan Düzenle");
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
      street: "",
      city: "",
      district: "",
      neighborhood: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      buildingNumber: "",
      floor: "",
      apartmentNumber: "",
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/listing/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();

          setFormData({
            ...formData,
            ...data,
            address: {
              ...formData.address,
              ...data.address,
            },
          });
        } else {
          setError("İlan yüklenemedi.");
        }
      } catch {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/listing/updateListing/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            sizeM2: parseFloat(formData.sizeM2),
            livingAreaM2: formData.livingAreaM2
              ? parseFloat(formData.livingAreaM2)
              : null,
            bedroomCount: formData.bedroomCount
              ? parseInt(formData.bedroomCount)
              : null,
            bathroomCount: formData.bathroomCount
              ? parseInt(formData.bathroomCount)
              : null,
            roomCount: formData.roomCount
              ? parseInt(formData.roomCount)
              : null,
            floorNumber: formData.floorNumber
              ? parseInt(formData.floorNumber)
              : null,
            totalFloors: formData.totalFloors
              ? parseInt(formData.totalFloors)
              : null,
            buildYear: formData.buildYear
              ? parseInt(formData.buildYear)
              : null,
            address: {
              ...formData.address,
              latitude: formData.address.latitude
                ? parseFloat(formData.address.latitude)
                : null,
              longitude: formData.address.longitude
                ? parseFloat(formData.address.longitude)
                : null,
            },
          }),
        }
      );

      if (response.ok) {
        setMessage("İlan başarıyla güncellendi!");
        setTimeout(() => navigate("/listings"), 1500);
      } else {
        const data = await response.json();
        setError(data.message || "İlan güncellenirken bir hata oluştu.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Lütfen en az bir resim seçin.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();

      selectedFiles.forEach((file) => formDataObj.append("files", file));

      const response = await fetch(
        `http://localhost:8080/listing/${id}/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataObj,
        }
      );

      if (response.ok) {
        setMessage("Resimler başarıyla yüklendi!");
        setSelectedFiles([]);
      } else {
        setError("Resim yükleme başarısız oldu.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] outline-none focus:border-amber-400 transition-colors";

  const labelClass =
    "block text-sm font-medium text-[#94a3b8] mb-1";

  const sectionClass =
    "bg-[#1e293b] border border-[#334155] rounded-2xl p-6 space-y-4";

  const sectionTitle =
    "text-white font-semibold text-lg mb-2";

  const detailFields = [
    { label: "Fiyat *", name: "price", required: true },
    { label: "Brüt Alan (m²) *", name: "sizeM2", required: true },
    { label: "Net Alan (m²)", name: "livingAreaM2" },
    { label: "Yatak Odası", name: "bedroomCount" },
    { label: "Banyo Sayısı", name: "bathroomCount" },
    { label: "Oda Sayısı", name: "roomCount" },
    { label: "Bulunduğu Kat", name: "floorNumber" },
    { label: "Toplam Kat", name: "totalFloors" },
    { label: "Bina Yaşı/Yapım Yılı", name: "buildYear" },
  ];

  const addressFields = [
    { label: "İl", name: "city" },
    { label: "İlçe", name: "district" },
    { label: "Mahalle", name: "neighborhood" },
    { label: "Sokak/Cadde", name: "street" },
    { label: "Bina No", name: "buildingNumber" },
    { label: "Kat", name: "floor" },
    { label: "Daire No", name: "apartmentNumber" },
    { label: "Posta Kodu", name: "zipCode" },
    { label: "Enlem (Latitude)", name: "latitude", type: "number" },
    { label: "Boylam (Longitude)", name: "longitude", type: "number" },
  ];

  // Özellik isimlerini Türkçeleştirmek için bir sözlük
  const featureLabels = {
    hasParking: "Otopark",
    hasElevator: "Asansör",
    hasBalcony: "Balkon",
    hasGarden: "Bahçeli",
    isFurnished: "Eşyalı"
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-8">
        Yükleniyor...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate("/listings")}
          className="mb-6 text-[#94a3b8] hover:text-amber-400 text-sm"
        >
          ← İlanlara Dön
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">
          İlanı Düzenle
        </h1>

        {error && (
          <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-400 mb-6 bg-green-400/10 rounded-xl px-4 py-3 text-sm">
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">

          {/* Temel Bilgiler */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Temel Bilgiler</h2>

            <div>
              <label className={labelClass}>Başlık *</label>
              <input name="title" required className={inputClass}
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Beşiktaş'ta Deniz Manzaralı 3+1"/>
            </div>

            <div>
              <label className={labelClass}>Açıklama</label>
              <textarea name="description" rows={3}
                className={inputClass}
                value={formData.description}
                onChange={handleChange}
                placeholder="İlan detaylarını buraya yazın..."/>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className={labelClass}>Gayrimenkul Tipi *</label>
                <select name="propertyType" className={inputClass}
                  value={formData.propertyType}
                  onChange={handleChange}>
                  {Object.entries(propertyTypes).map(([k,v])=>(
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Durum</label>
                <select name="status" className={inputClass}
                  value={formData.status}
                  onChange={handleChange}>
                  {Object.entries(listingStatuses).map(([k,v])=>(
                    <option key={k} value={k}>{v === "Active" ? "Aktif" : v === "Sold" ? "Satıldı" : "Pasif"}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Teknik Detaylar */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Teknik Detaylar</h2>

            <div className="grid grid-cols-2 gap-4">
              {detailFields.map((field)=>(
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    name={field.name}
                    type="number"
                    required={field.required}
                    className={inputClass}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div>
                <label className={labelClass}>Isınma Tipi</label>
                <select name="heatingType" className={inputClass}
                  value={formData.heatingType}
                  onChange={handleChange}>
                  {Object.entries(heatingTypes).map(([k,v])=>(
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Ek Özellikler</h2>

            <div className="grid grid-cols-3 gap-4">
              {Object.keys(featureLabels).map((feature)=>(
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    name={feature}
                    checked={formData[feature]}
                    onChange={handleChange}
                    className="accent-amber-400"/>
                  <span className="text-[#94a3b8] text-sm">
                    {featureLabels[feature]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Adres Bilgileri */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Adres Bilgileri</h2>

            <div className="grid grid-cols-2 gap-4">
              {addressFields.map((field)=>(
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    className={inputClass}
                    value={formData.address[field.name]}
                    onChange={handleAddressChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition shadow-lg shadow-amber-400/20"
          >
            Değişiklikleri Kaydet
          </button>

        </form>

        {/* Resim Yükleme Bölümü */}
        <div className={sectionClass + " mt-6"}>
          <h2 className={sectionTitle}>Resim Yükle</h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e)=>setSelectedFiles(Array.from(e.target.files))}
            className="mb-4 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-[#0f172a] hover:file:bg-amber-300 cursor-pointer"
          />

          {selectedFiles.length>0 && (
            <p className="text-[#94a3b8] text-sm mb-4">
              {selectedFiles.length} dosya seçildi
            </p>
          )}

          <button
            onClick={handleImageUpload}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition border border-slate-500"
          >
            Seçili Resimleri Yükle
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditListingPage;