export const securedFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Header'ları hazırla ve Token'ı otomatik ekle
  const defaultHeaders = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers: defaultHeaders });

    // Global 401 Kontrolü
    if (response.status === 401) {
      localStorage.removeItem("token");
      
      // Kullanıcıyı bilgilendir
      alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
      
      // Sayfayı login'e yönlendir
      window.location.href = "/login";
      return null;
    }

    return response;
  } catch (error) {
    console.error("API Hatası:", error);
    throw error;
  }
};