import React, { useState, useEffect } from "react";
import { userBuyerProfileEnums } from "../hooks/userBuyerProfileEnums.js";

const emptyForm = {
    profileName: "",
    householdType: "",
    lifestylePreference: "",
    priority: "",
    budgetSensitivity: "",
    purchaseIntent: "",
    ageGroup: "",
    hasChildren: null,
    hasPets: null,
    hasVehicle: null,
    hasDisabledMember: null,
    willingToRenovate: null,
    minSizeM2: "",
    minBedrooms: "",
    budgetMax: "",
    commuteImportance: "",
};

function ProfilesPage() {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const enums = userBuyerProfileEnums();

    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

    useEffect(() => { fetchProfiles(); }, []);

    const fetchProfiles = async () => {
        try {
            const response = await fetch("http://localhost:8080/buyer-profile/getAll", { headers });
            if (response.ok) setProfiles(await response.json());
            else setError("Failed to load profiles.");
        } catch { setError("Could not connect to server."); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const body = {
            ...formData,
            minSizeM2: formData.minSizeM2 ? parseInt(formData.minSizeM2) : null,
            minBedrooms: formData.minBedrooms ? parseInt(formData.minBedrooms) : null,
            budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
            householdType: formData.householdType || null,
            lifestylePreference: formData.lifestylePreference || null,
            priority: formData.priority || null,
            budgetSensitivity: formData.budgetSensitivity || null,
            purchaseIntent: formData.purchaseIntent || null,
            ageGroup: formData.ageGroup || null,
            commuteImportance: formData.commuteImportance || null,
        };

        const url = editingId
            ? `http://localhost:8080/buyer-profile/update/${editingId}`
            : "http://localhost:8080/buyer-profile/create";
        const method = editingId ? "PUT" : "POST";

        try {
            const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
            if (response.ok) {
                await fetchProfiles();
                setShowForm(false);
                setEditingId(null);
                setFormData(emptyForm);
            } else {
                const data = await response.json();
                setError(data.message || "Failed to save profile.");
            }
        } catch { setError("Could not connect to server."); }
    };

    const handleEdit = (profile) => {
        setFormData({
            profileName: profile.profileName || "",
            householdType: profile.householdType || "",
            lifestylePreference: profile.lifestylePreference || "",
            priority: profile.priority || "",
            budgetSensitivity: profile.budgetSensitivity || "",
            purchaseIntent: profile.purchaseIntent || "",
            ageGroup: profile.ageGroup || "",
            hasChildren: profile.hasChildren ?? null,
            hasPets: profile.hasPets ?? null,
            hasVehicle: profile.hasVehicle ?? null,
            hasDisabledMember: profile.hasDisabledMember ?? null,
            willingToRenovate: profile.willingToRenovate ?? null,
            minSizeM2: profile.minSizeM2 || "",
            minBedrooms: profile.minBedrooms || "",
            budgetMax: profile.budgetMax || "",
            commuteImportance: profile.commuteImportance || "",
        });
        setEditingId(profile.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this profile?")) return;
        try {
            const response = await fetch(`http://localhost:8080/buyer-profile/delete/${id}`, {
                method: "DELETE", headers
            });
            if (response.ok) setProfiles(profiles.filter(p => p.id !== id));
            else setError("Failed to delete profile.");
        } catch { setError("Could not connect to server."); }
    };

    const inputClass = "w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] outline-none focus:border-amber-400 transition-colors text-sm";
    const labelClass = "block text-xs font-medium text-[#94a3b8] mb-1";

    const TriToggle = ({ label, field }) => (
        <div>
            <p className={labelClass}>{label}</p>
            <div className="flex gap-2">
                {[{ label: "Yes", value: true }, { label: "No", value: false }, { label: "—", value: null }].map(opt => (
                    <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setFormData({ ...formData, [field]: opt.value })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData[field] === opt.value
                            ? "bg-amber-400 border-amber-400 text-[#0f172a]"
                            : "bg-[#0f172a] border-[#334155] text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const selectFields = [
        { label: "Household Type", field: "householdType", enumKey: "householdType" },
        { label: "Lifestyle", field: "lifestylePreference", enumKey: "lifestylePreference" },
        { label: "Priority", field: "priority", enumKey: "priority" },
        { label: "Budget Sensitivity", field: "budgetSensitivity", enumKey: "budgetSensitivity" },
        { label: "Purchase Intent", field: "purchaseIntent", enumKey: "purchaseIntent" },
        { label: "Age Group", field: "ageGroup", enumKey: "ageGroup" },
        { label: "Commute Importance", field: "commuteImportance", enumKey: "commuteImportance" },
    ];

    const booleanFields = [
        { label: "Has Children", field: "hasChildren" },
        { label: "Has Pets", field: "hasPets" },
        { label: "Has Vehicle", field: "hasVehicle" },
        { label: "Has Disabled Member", field: "hasDisabledMember" },
        { label: "Willing to Renovate", field: "willingToRenovate" },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Buyer Profiles</h1>
                        <p className="text-[#64748b] text-sm mt-1">Manage your profiles for personalized AI analysis</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
                    >
                        + New Profile
                    </button>
                </div>

                {error && <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">{error}</p>}

                {/* Profile Cards */}
                {!showForm && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {profiles.length === 0 && (
                            <div className="col-span-3 text-center py-24">
                                <p className="text-5xl mb-4">👤</p>
                                <p className="text-white font-semibold text-lg mb-1">No profiles yet</p>
                                <p className="text-[#64748b] text-sm">Create a profile to get personalized AI analysis</p>
                            </div>
                        )}
                        {profiles.map(profile => (
                            <div key={profile.id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-white font-semibold text-lg">{profile.profileName}</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(profile)}
                                            className="px-3 py-1 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white hover:border-amber-400/40 rounded-lg text-xs transition-all">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(profile.id)}
                                            className="px-3 py-1 bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 rounded-lg text-xs transition-all">
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="space-y-2 mb-4">
                                    {[
                                        { label: "Household", value: enums.householdType?.[profile.householdType] },
                                        { label: "Lifestyle", value: enums.lifestylePreference?.[profile.lifestylePreference] },
                                        { label: "Priority", value: enums.priority?.[profile.priority] },
                                        { label: "Intent", value: enums.purchaseIntent?.[profile.purchaseIntent] },
                                        { label: "Budget Max", value: profile.budgetMax ? `₺${Number(profile.budgetMax).toLocaleString()}` : null },
                                        { label: "Min Size", value: profile.minSizeM2 ? `${profile.minSizeM2} m²` : null },
                                        { label: "Min Bedrooms", value: profile.minBedrooms },
                                    ].filter(item => item.value).map(({ label, value }) => (
                                        <div key={label} className="flex justify-between text-sm border-b border-[#334155] pb-1.5 last:border-0">
                                            <span className="text-[#64748b]">{label}</span>
                                            <span className="text-white font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Boolean chips */}
                                <div className="flex flex-wrap gap-2">
                                    {booleanFields
                                        .filter(f => profile[f.field] !== null && profile[f.field] !== undefined)
                                        .map(({ label, field }) => (
                                            <span key={field} className={`text-xs px-2 py-1 rounded-full border ${
                                                profile[field]
                                                ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                                                : "bg-red-400/10 text-red-400 border-red-400/20"
                                            }`}>
                                                {profile[field] ? "✓" : "✗"} {label}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold text-lg">
                                {editingId ? "Edit Profile" : "New Profile"}
                            </h2>
                            <button
                                onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }}
                                className="text-[#64748b] hover:text-white text-sm transition-colors"
                            >
                                ✕ Cancel
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Profile Name */}
                            <div>
                                <label className={labelClass}>Profile Name *</label>
                                <input required className={inputClass}
                                    placeholder='e.g. "My Family", "Investment"'
                                    value={formData.profileName}
                                    onChange={e => setFormData({ ...formData, profileName: e.target.value })}
                                />
                            </div>

                            {/* Select fields */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectFields.map(({ label, field, enumKey }) => (
                                    <div key={field}>
                                        <label className={labelClass}>{label}</label>
                                        <select className={inputClass}
                                            value={formData[field]}
                                            onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                                        >
                                            <option value="">Not specified</option>
                                            {Object.entries(enums[enumKey] || {}).map(([key, val]) => (
                                                <option key={key} value={key}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {/* Number fields */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Min Size (m²)</label>
                                    <input type="number" className={inputClass} placeholder="e.g. 80"
                                        value={formData.minSizeM2}
                                        onChange={e => setFormData({ ...formData, minSizeM2: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Min Bedrooms</label>
                                    <input type="number" className={inputClass} placeholder="e.g. 2"
                                        value={formData.minBedrooms}
                                        onChange={e => setFormData({ ...formData, minBedrooms: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Budget Max (₺)</label>
                                    <input type="number" className={inputClass} placeholder="e.g. 5000000"
                                        value={formData.budgetMax}
                                        onChange={e => setFormData({ ...formData, budgetMax: e.target.value })} />
                                </div>
                            </div>

                            {/* Boolean toggles */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {booleanFields.map(({ label, field }) => (
                                    <TriToggle key={field} label={label} field={field} />
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button type="submit"
                                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm">
                                    {editingId ? "Save Changes" : "Create Profile"}
                                </button>
                                <button type="button"
                                    onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }}
                                    className="px-6 py-2.5 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white rounded-xl transition-colors text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilesPage;