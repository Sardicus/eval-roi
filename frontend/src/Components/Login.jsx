import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { usePageTitle } from '../hooks/usePageTitle';
import {
  Shield, TrendingUp, Thermometer, MapPin,
  ChevronRight, Zap, Eye, EyeOff, Loader2,
  BarChart3, Activity, ArrowRight
} from "lucide-react";

// ─── Animated Market Pulse Ticker ───────────────────────────────────────────
const TICKER_ITEMS = [
  { label: "İzmir Ort. m²", value: "₺52.400", delta: "+%3,2", up: true },
  { label: "İstanbul Ort. m²", value: "₺89.200", delta: "+%1,8", up: true },
  { label: "Bursa Ort. m²", value: "₺38.600", delta: "-%0,4", up: false },
  { label: "Ankara Ort. m²", value: "₺41.100", delta: "+%2,1", up: true },
  { label: "Antalya Ort. m²", value: "₺67.800", delta: "+%5,6", up: true },
  { label: "Risk Endeksi TR", value: "0.34", delta: "DÜŞÜK", up: true },
];

function MarketTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-2 bg-black/20 backdrop-blur-sm">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <Activity className="w-3 h-3 text-amber-400/60" />
            <span className="text-[#64748b] text-xs font-mono">{item.label}</span>
            <span className="text-white text-xs font-bold font-mono">{item.value}</span>
            <span className={`text-xs font-mono font-semibold ${item.up ? "text-emerald-400" : "text-red-400"}`}>
              {item.delta}
            </span>
            <span className="text-[#334155] mx-2">│</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Animated Scan Grid Background ──────────────────────────────────────────
function ScanGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(251,191,36,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(251,191,36,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.6, 1] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-8 blur-3xl"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
    </div>
  );
}

// ─── Feature Cards ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Shield,
    title: "Bina Güvenlik Skoru",
    desc: "Deprem riski, yapım yılı ve yapısal analiz",
    accent: "#f59e0b",
    value: "94/100",
  },
  {
    icon: TrendingUp,
    title: "Fiyat Zekası",
    desc: "İlçe ve şehir ortalamaları ile karşılaştırma",
    accent: "#34d399",
    value: "↓%12",
  },
  {
    icon: Thermometer,
    title: "Konfor Analizi",
    desc: "Isınma verimliliği ve konum bazlı skorlama",
    accent: "#60a5fa",
    value: "B+",
  },
  {
    icon: MapPin,
    title: "Lokasyon Analizi",
    desc: "Risk bölgeleri ve sosyal olanak skorlaması",
    accent: "#a78bfa",
    value: "Bölge 2",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, scale: 1.02 }}
      className="relative group p-4 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm overflow-hidden cursor-default"
      style={{ transition: "box-shadow 0.3s" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${feature.accent}18 0%, transparent 60%)` }}
      />
      <div className="flex items-start justify-between mb-2">
        <div className="p-1.5 rounded-lg" style={{ background: `${feature.accent}18` }}>
          <Icon className="w-4 h-4" style={{ color: feature.accent }} />
        </div>
        <span className="font-mono text-xs font-bold" style={{ color: feature.accent }}>
          {feature.value}
        </span>
      </div>
      <p className="text-white text-sm font-semibold mb-0.5">{feature.title}</p>
      <p className="text-[#475569] text-xs leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

// ─── Smart Input ─────────────────────────────────────────────────────────────
function SmartInput({ label, type = "text", placeholder, value, onChange, onKeyDown, required, icon: Icon, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <motion.div
        animate={{
          borderColor: focused ? "rgba(251,191,36,0.6)" : "rgba(51,65,85,0.8)",
          boxShadow: focused ? "0 0 0 1px rgba(251,191,36,0.2), 0 0 16px rgba(251,191,36,0.08)" : "none",
        }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#0f172a]/80 backdrop-blur-sm"
      >
        {Icon && <Icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${focused ? "text-amber-400" : "text-[#334155]"}`} />}
        <input
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-white placeholder-[#334155] text-sm outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-[#334155] hover:text-amber-400 transition-colors"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function LoginForm() {
  usePageTitle("Gayrimenkul Zekası"); 
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    email: "", username: "", password: "", confirmPassword: "", role: "USER",
  });

  const [loginData, setLoginData] = useState({
    loginWith: "0", username: "", email: "", password: "",
  });

  const containsSpace = (val) => /\s/.test(val);
  const blockSpace = (e) => { if (e.key === " ") e.preventDefault(); };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); setError(""); setLoading(true);

    const fields = { username: registerData.username, email: registerData.email, password: registerData.password };
    if (Object.values(fields).some(containsSpace)) {
      setError("Alanlar boşluk içeremez.");
      setLoading(false); return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false); return;
    }

    try {
      const registerResponse = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registerData,
          username: registerData.username.trim(),
          email: registerData.email.trim(),
        }),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        setError(data.message || "Kayıt başarısız.");
        setLoading(false); return;
      }

      const loginResponse = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginWith: "0",
          username: registerData.username.trim(),
          password: registerData.password,
        }),
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        localStorage.setItem("token", data.accessToken);
        navigate("/listings");
      } else {
        setMessage("Hesap oluşturuldu! Lütfen giriş yapın.");
        setIsLoginMode(true);
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); setError(""); setLoading(true);

    const identifier = loginData.loginWith === "0" ? loginData.username : loginData.email;
    if (containsSpace(identifier) || containsSpace(loginData.password)) {
      setError("Alanlar boşluk içeremez.");
      setLoading(false); return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...loginData,
          username: loginData.username.trim(),
          email: loginData.email.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        navigate("/listings");
      } else {
        const data = await response.json();
        setError(data.message || "Geçersiz kimlik bilgileri.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (login) => {
    setIsLoginMode(login);
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#060e1a] flex flex-col">

      <MarketTicker />

      <div className="flex flex-1">

        {/* ── Left Panel ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden lg:flex flex-col justify-between w-[58%] p-14 relative overflow-hidden"
        >
          <ScanGrid />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">
                Eval<span className="text-amber-400">ROI</span>
              </h1>
            </div>
            <p className="text-[#334155] text-[10px] mt-1 tracking-[0.25em] uppercase font-semibold ml-10">
              Gayrimenkul Zekası Platformu
            </p>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 mb-6">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 text-[11px] font-bold tracking-[0.15em] uppercase">Yapay Zeka Destekli Analiz</span>
            </div>

            <h2 className="text-[3.25rem] font-black text-white leading-[1.05] tracking-tight mb-5">
              Her Mülkün <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #fcd34d)" }}>
                Gerçek Değerini
              </span><br />
              Keşfedin.
            </h2>

            <p className="text-[#475569] text-base leading-relaxed max-w-sm">
              Güvenlik, fiyat, konum ve konfor ekseninde çok boyutlu skorlama — Türkiye pazarı için özel geliştirildi.
            </p>

            <div className="flex items-center gap-2 mt-4 text-[#334155] text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>3 Şehir · 40+ İlçeden Canlı Veri</span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Right Panel ────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative">
          <div className="absolute inset-0 border-l border-white/[0.04]"
            style={{ background: "linear-gradient(135deg, #080f1e 0%, #060e1a 100%)" }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative w-full max-w-[400px]"
          >
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Eval<span className="text-amber-400">ROI</span>
              </h1>
              <p className="text-[#334155] text-[10px] mt-1 tracking-[0.2em] uppercase">Gayrimenkul Zekası</p>
            </div>

            <div className="relative rounded-2xl border border-white/[0.07] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(8,15,30,0.95) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(251,191,36,0.04)",
              }}
            >
              <div className="h-px w-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)" }} />

              <div className="p-7">
                <div className="relative flex h-10 mb-7 p-1 rounded-xl bg-[#0a1628]/80 border border-white/[0.06]">
                  <motion.div
                    layoutId="toggle-pill"
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
                    animate={{ left: isLoginMode ? "4px" : "calc(50% + 0px)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                  {["Giriş Yap", "Kayıt Ol"].map((label, i) => (
                    <button
                      key={label}
                      onClick={() => switchMode(i === 0)}
                      className="relative z-10 w-1/2 text-xs font-bold tracking-wide transition-colors duration-200"
                      style={{ color: (i === 0 ? isLoginMode : !isLoginMode) ? "#060e1a" : "#475569" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLoginMode ? "login-h" : "reg-h"}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    <h3 className="text-white text-lg font-black tracking-tight">
                      {isLoginMode ? "Tekrar hoş geldiniz" : "Hesap oluşturun"}
                    </h3>
                    <p className="text-[#475569] text-xs mt-1">
                      {isLoginMode ? "Devam etmek için giriş yapın" : "Mülkleri analiz etmeye bugün başlayın"}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center"
                    >
                      {message}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isLoginMode ? (
                    <motion.form
                      key="login-form"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onSubmit={handleLogin}
                      className="space-y-3"
                    >
                      <div className="flex gap-5 mb-1">
                        {[{ val: "0", label: "Kullanıcı Adı" }, { val: "1", label: "E-posta" }].map(({ val, label }) => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <div
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 cursor-pointer"
                              style={{
                                borderColor: loginData.loginWith === val ? "#f59e0b" : "#334155",
                                background: loginData.loginWith === val ? "#f59e0b" : "transparent",
                              }}
                              onClick={() => setLoginData({ ...loginData, loginWith: val, email: "", username: "" })}
                            >
                              {loginData.loginWith === val && <div className="w-1.5 h-1.5 rounded-full bg-[#060e1a]" />}
                            </div>
                            <span className="text-[#64748b] text-xs cursor-pointer"
                              onClick={() => setLoginData({ ...loginData, loginWith: val, email: "", username: "" })}>
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {loginData.loginWith === "0" ? (
                          <motion.div key="uname" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <SmartInput
                              placeholder="Kullanıcı Adı" value={loginData.username}
                              autoComplete="off"
                              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                              onKeyDown={blockSpace} required
                            />
                          </motion.div>
                        ) : (
                          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <SmartInput
                              type="email" placeholder="E-posta adresi" value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              onKeyDown={blockSpace} required
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <SmartInput
                        type="password" placeholder="Şifre" value={loginData.password}
                        autoComplete="off"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        onKeyDown={blockSpace} required
                      />

                      <div className="flex justify-end">
                        <a href="#" className="text-amber-400/70 hover:text-amber-400 text-xs transition-colors">
                          Şifremi unuttum
                        </a>
                      </div>

                      <SubmitButton loading={loading} label="Giriş Yap" />

                      <p className="text-center text-[#334155] text-xs pt-1">
                        Hesabınız yok mu?{" "}
                        <button type="button" onClick={() => switchMode(false)}
                          className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                          Yeni hesap oluştur
                        </button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register-form"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onSubmit={handleRegister}
                      className="space-y-3"
                    >
                      <SmartInput
                        placeholder="Kullanıcı Adı" value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        onKeyDown={blockSpace} required
                      />
                      <SmartInput
                        type="email" placeholder="E-posta adresi" value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        onKeyDown={blockSpace} required
                      />
                      <SmartInput
                        type="password" placeholder="Şifre" value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        onKeyDown={blockSpace} required
                      />
                      <SmartInput
                        type="password" placeholder="Şifre Onayla" value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[{ val: "USER", label: "Alıcı / Kiracı" }, { val: "OWNER", label: "Mülk Sahibi" }].map(({ val, label }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setRegisterData({ ...registerData, role: val })}
                            className="relative py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200"
                            style={{
                              borderColor: registerData.role === val ? "rgba(251,191,36,0.5)" : "rgba(51,65,85,0.6)",
                              background: registerData.role === val ? "rgba(251,191,36,0.08)" : "rgba(15,23,42,0.5)",
                              color: registerData.role === val ? "#f59e0b" : "#475569",
                              boxShadow: registerData.role === val ? "0 0 12px rgba(251,191,36,0.1)" : "none",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <SubmitButton loading={loading} label="Hesap Oluştur" />

                      <p className="text-center text-[#334155] text-xs pt-1">
                        Zaten hesabınız var mı?{" "}
                        <button type="button" onClick={() => switchMode(true)}
                          className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                          Giriş yapın
                        </button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-center text-[#1e293b] text-[10px] mt-4 tracking-widest uppercase">
              Güvenli · Gayrimenkul Zekası Platformu
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Button ────────────────────────────────────────────────────────────
function SubmitButton({ loading, label }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileTap={{ scale: 0.98 }}
      className="relative w-full py-3 rounded-xl font-black text-sm tracking-wide overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        color: "#060e1a",
        boxShadow: "0 4px 24px rgba(245,158,11,0.25)",
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)" }}
      />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </span>
    </motion.button>
  );
}

export default LoginForm;