import React from "react";
import PriceFilter from "./PriceFilter";
import { useEnums } from "../hooks/useEnums";

export default function ListingFilter({ filters, setFilters, onApply }) {
  const { propertyTypes } = useEnums();

  return (
    <div className="mb-6 p-4 bg-[#1e293b] border border-[#334155] rounded-lg flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="İlan Başlığı"
          value={filters.title}
          onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
          className="px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155] placeholder-[#64748b] outline-none focus:border-amber-400"
        />
        <input
          type="text"
          placeholder="Şehir"
          value={filters.city}
          onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
          className="px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155] placeholder-[#64748b] outline-none focus:border-amber-400"
        />
      </div>

      {/* Konut Tipleri Çoklu Seçim */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(propertyTypes).map(([key, label]) => (
          <label
            key={key}
            className={`px-3 py-1 rounded-lg cursor-pointer border transition-all ${
              filters.propertyType.includes(key)
                ? "bg-amber-400 text-[#0f172a] border-amber-400 font-medium"
                : "bg-[#0f172a] text-[#94a3b8] border-[#334155] hover:border-[#475569]"
            }`}
          >
            <input
              type="checkbox"
              value={key}
              checked={filters.propertyType.includes(key)}
              onChange={(e) => {
                const val = e.target.value;
                setFilters(prev => {
                  const updated = prev.propertyType.includes(val)
                    ? prev.propertyType.filter(v => v !== val)
                    : [...prev.propertyType, val];
                  return { ...prev, propertyType: updated };
                });
              }}
              className="hidden"
            />
            {label}
          </label>
        ))}
      </div>

      {/* İlan Durumu */}
      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        className="px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155] outline-none focus:border-amber-400 cursor-pointer"
      >
        <option value="">Tüm Durumlar</option>
        <option value="ACTIVE">Aktif</option>
        <option value="INACTIVE">Pasif</option>
        <option value="SOLD">Satıldı</option>
      </select>

      {/* Fiyat Filtresi */}
      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        setMinPrice={(val) => setFilters(prev => ({ ...prev, minPrice: val }))}
        setMaxPrice={(val) => setFilters(prev => ({ ...prev, maxPrice: val }))}
      />

      <button
        onClick={onApply}
        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0f172a] rounded-lg font-bold transition-colors shadow-lg shadow-amber-400/10"
      >
        Filtreleri Uygula
      </button>
    </div>
  );
}