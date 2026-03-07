import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";

function EditListingPage() {
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
        const response = await fetch(`http://localhost:8080/listing/get/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title || "",
            description: data.description || "",
            propertyType: data.propertyType || "APARTMENT",
            status: data.status || "ACTIVE",
            price: data.price || "",
            sizeM2: data.sizeM2 || "",
            livingAreaM2: data.livingAreaM2 || "",
            bedroomCount: data.bedroomCount || "",
            bathroomCount: data.bathroomCount || "",
            roomCount: data.roomCount || "",
            floorNumber: data.floorNumber || "",
            totalFloors: data.totalFloors || "",
            buildYear: data.buildYear || "",
            hasParking: data.hasParking || false,
            hasElevator: data.hasElevator || false,
            hasBalcony: data.hasBalcony || false,
            hasGarden: data.hasGarden || false,
            isFurnished: data.isFurnished || false,
            heatingType: data.heatingType || "KOMBI",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              district: data.address?.district || "",
              neighborhood: data.address?.neighborhood || "",
              zipCode: data.address?.zipCode || "",
              latitude: data.address?.latitude || "",
              longitude: data.address?.longitude || "",
              buildingNumber: data.address?.buildingNumber || "",
              floor: data.address?.floor || "",
              apartmentNumber: data.address?.apartmentNumber || "",
            },
          });
        } else {
          setError("Failed to load listing.");
        }
      } catch (err) {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, address: { ...formData.address, [name]: value } });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/listing/updateListing/${id}`, {
        method: "PUT",
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
        setMessage("Listing updated successfully!");
        navigate("/listings");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update listing.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();
      selectedFiles.forEach(file => formDataObj.append("files", file));
      const response = await fetch(`http://localhost:8080/listing/${id}/images`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formDataObj,
      });
      if (response.ok) {
        setMessage("Images uploaded successfully!");
        setSelectedFiles([]);
      } else {
        setError("Failed to upload images.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-cyan-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-6">

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
                {Object.entries(propertyTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" className={inputClass} value={formData.status} onChange={handleChange}>
                {Object.entries(listingStatuses).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
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
                {Object.entries(heatingTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
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
          Save Changes
        </button>
      </form>

      {/* Image Upload */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
        <input type="file" multiple accept="image/*"
          onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
          className="mb-4" />
        {selectedFiles.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">{selectedFiles.length} file(s) selected</p>
        )}
        <button onClick={handleImageUpload} className="px-6 py-2 bg-cyan-500 text-white rounded-full hover:opacity-90">
          Upload Images
        </button>
      </div>

    </div>
  );
}

export default EditListingPage;