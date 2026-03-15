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
          placeholder="Title"
          value={filters.title}
          onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
          className="px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155]"
        />
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
          className="px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155]"
        />
      </div>

      {/* Property Types Multi-select */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(propertyTypes).map(([key, label]) => (
          <label
            key={key}
            className={`px-3 py-1 rounded-lg cursor-pointer border ${
              filters.propertyType.includes(key)
                ? "bg-amber-400 text-[#0f172a] border-amber-400"
                : "bg-[#0f172a] text-white border-[#334155]"
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

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        className="px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155]"
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="SOLD">Sold</option>
      </select>

      {/* Price Filter */}
      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        setMinPrice={(val) => setFilters(prev => ({ ...prev, minPrice: val }))}
        setMaxPrice={(val) => setFilters(prev => ({ ...prev, maxPrice: val }))}
      />

      <button
        onClick={onApply}
        className="px-4 py-2 bg-amber-400 text-[#0f172a] rounded-lg font-bold"
      >
        Apply Filters
      </button>
    </div>
  );
}