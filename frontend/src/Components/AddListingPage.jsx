import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PROPERTY_TYPES = ["APARTMENT", "RESIDENCE", "VILLA", "DETACHED_HOUSE", "DUPLEX", "TRIPLEX", "PENTHOUSE", "STUDIO", "LAND", "FIELD", "VINEYARD", "OFFICE", "SHOP", "WAREHOUSE", "HOTEL", "PLAZA", "BUILDING", "FARMHOUSE"];
const LISTING_STATUSES = ["ACTIVE", "INACTIVE", "SOLD"];
const HEATING_TYPES = ["KOMBI", "CENTRAL_NATURAL_GAS", "CENTRAL_COAL", "CENTRAL_ELECTRIC", "UNDERFLOOR", "FLOOR_HEATER", "AIR_CONDITIONING", "STOVE_WOOD", "STOVE_COAL", "GEOTHERMAL", "NONE"];

function AddListingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
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
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
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
      if (response.ok) {
        navigate("/listings");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create listing.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-cyan-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div>
            <label className={labelClass}>Title *</label>
            <input name="title" required className={inputClass} value={formData.title} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" rows={3} className={inputClass} value={formData.description} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Property Type *</label>
              <select name="propertyType" required className={inputClass} value={formData.propertyType} onChange={handleChange}>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" className={inputClass} value={formData.status} onChange={handleChange}>
                {LISTING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price *</label>
              <input name="price" type="number" required className={inputClass} value={formData.price} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Size (m²) *</label>
              <input name="sizeM2" type="number" required className={inputClass} value={formData.sizeM2} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Living Area (m²)</label>
              <input name="livingAreaM2" type="number" className={inputClass} value={formData.livingAreaM2} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input name="bedroomCount" type="number" className={inputClass} value={formData.bedroomCount} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input name="bathroomCount" type="number" className={inputClass} value={formData.bathroomCount} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Rooms</label>
              <input name="roomCount" type="number" className={inputClass} value={formData.roomCount} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Floor</label>
              <input name="floorNumber" type="number" className={inputClass} value={formData.floorNumber} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Total Floors</label>
              <input name="totalFloors" type="number" className={inputClass} value={formData.totalFloors} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Build Year</label>
              <input name="buildYear" type="number" className={inputClass} value={formData.buildYear} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Heating Type</label>
              <select name="heatingType" className={inputClass} value={formData.heatingType} onChange={handleChange}>
                {HEATING_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-3 gap-4">
            {["hasParking", "hasElevator", "hasBalcony", "hasGarden", "isFurnished"].map((feature) => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={feature} checked={formData[feature]} onChange={handleChange} />
                <span className="text-sm">{feature.replace(/([A-Z])/g, ' $1').replace('has ', 'Has ').replace('is ', 'Is ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input name="city" className={inputClass} value={formData.address.city} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>District</label>
              <input name="district" className={inputClass} value={formData.address.district} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Neighborhood</label>
              <input name="neighborhood" className={inputClass} value={formData.address.neighborhood} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Street</label>
              <input name="street" className={inputClass} value={formData.address.street} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Building Number</label>
              <input name="buildingNumber" className={inputClass} value={formData.address.buildingNumber} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Floor</label>
              <input name="floor" className={inputClass} value={formData.address.floor} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Apartment Number</label>
              <input name="apartmentNumber" className={inputClass} value={formData.address.apartmentNumber} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Zip Code</label>
              <input name="zipCode" className={inputClass} value={formData.address.zipCode} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Latitude</label>
              <input name="latitude" type="number" className={inputClass} value={formData.address.latitude} onChange={handleAddressChange} />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input name="longitude" type="number" className={inputClass} value={formData.address.longitude} onChange={handleAddressChange} />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition">
          Create Listing
        </button>

      </form>
    </div>
  );
}

export default AddListingPage;