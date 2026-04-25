import React, { useState, useEffect } from "react";
import { securedFetch } from "../utils/api";
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useAuth } from '../hooks/useAuth.js';

function UserProfilePage() {
    usePageTitle("Profil Yönetimi");
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await securedFetch("http://localhost:8080/userProfile");
            if (response && response.ok) {
                const data = await response.json();
                setProfile(data);
                setFormData({
                    username: data.username,
                    email: data.email,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    phoneNumber: data.phoneNumber || ""
                });
            } else {
                setError("Profil yüklenemedi.");
            }
        } catch {
            setError("Sunucuya bağlanılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await securedFetch("http://localhost:8080/userProfile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response && response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setEditMode(false);
                setSuccess("Profil bilgileriniz güncellendi.");
            } else {
                const data = await response.json();
                setError(data.message || "Profil güncellenemedi.");
            }
        } catch {
            setError("Sunucuya bağlanılamadı.");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Yeni şifreler eşleşmiyor.");
            return;
        }

        try {
            const response = await securedFetch("http://localhost:8080/userProfile/changePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordData)
            });

            if (response && response.ok) {
                setSuccess("Şifreniz başarıyla değiştirildi.");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setShowPasswordForm(false);
            } else {
                const data = await response.json();
                setError(data.message || "Şifre değiştirilemedi.");
            }
        } catch {
            setError("Sunucuya bağlanılamadı.");
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const cancelEdit = () => {
        setEditMode(false);
        if (profile) {
            setFormData({
                username: profile.username,
                email: profile.email,
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                phoneNumber: profile.phoneNumber || ""
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
                <div className="text-[#94a3b8]">Yükleniyor...</div>
            </div>
        );
    }

    const cardClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6";
    const inputClass = "w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] outline-none focus:border-amber-400 transition-colors text-sm";
    const labelClass = "block text-xs font-medium text-[#94a3b8] mb-1";

    return (
        <div className="min-h-screen bg-[#0f172a] p-8">
            <div className="max-w-4xl mx-auto">

                {/* Başlık */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Profil Yönetimi</h1>
                        <p className="text-[#64748b] text-sm mt-1">Hesap bilgilerinizi yönetin</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Profil Bilgileri */}
                    <div className={cardClass}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold text-lg">Profil Bilgileri</h2>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-lg text-xs transition-colors"
                                >
                                    Düzenle
                                </button>
                            )}
                        </div>

                        {!editMode ? (
                            // View Mode
                            <div className="space-y-4">
                                {[
                                    { label: "Kullanıcı Adı", value: profile?.username },
                                    { label: "E-posta", value: profile?.email },
                                    { label: "Ad", value: profile?.firstName || "-" },
                                    { label: "Soyad", value: profile?.lastName || "-" },
                                    { label: "Telefon", value: profile?.phoneNumber || "-" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0">
                                        <span className="text-[#64748b] text-sm">{label}</span>
                                        <span className="text-white font-medium text-sm">{value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Edit Mode
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>E-posta</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Ad</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Soyad</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Telefon</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-lg text-sm transition-colors"
                                    >
                                        Kaydet
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white rounded-lg text-sm transition-colors"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Şifre Değiştirme */}
                    <div className={cardClass}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold text-lg">Şifre Güvenliği</h2>
                            {!showPasswordForm && (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-lg text-xs transition-colors"
                                >
                                    Şifre Değiştir
                                </button>
                            )}
                        </div>

                        {!showPasswordForm ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-[#94a3b8] text-sm">Şifrenizi düzenli olarak değiştirmek hesab güvenliğiniz için önemlidir.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Mevcut Şifre</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Yeni Şifre</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Yeni Şifre (Tekrar)</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-lg text-sm transition-colors"
                                    >
                                        Şifreyi Değiştir
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: ""
                                            });
                                        }}
                                        className="px-4 py-2 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white rounded-lg text-sm transition-colors"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;
