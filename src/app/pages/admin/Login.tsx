import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (email === "admin@lflmi.org" && password === "password123") {
      localStorage.setItem("lflmi_admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0E5AA7]/8" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#D7261E]/6" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden">
          {/* Header band */}
          <div className="bg-[#0E5AA7] px-8 pt-8 pb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
                <ImageWithFallback
                  src={logoImg}
                  alt="Liberty For Living Ministries International"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-white text-2xl font-black mt-3">Admin Portal</h1>
              <p className="text-white/65 text-sm mt-1">Liberty For Living Ministries International</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-[#6b7897] text-sm text-center mb-7">Sign in to manage your church platform</p>

            {error && (
              <div className="flex items-center gap-2.5 bg-[#D7261E]/8 border border-[#D7261E]/20 text-[#D7261E] text-sm rounded-xl px-4 py-3 mb-6">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-[#0d1b2e] tracking-wide uppercase mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7897]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@lflmi.org"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0d1b2e] tracking-wide uppercase mb-2 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7897]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/30 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7897] hover:text-[#0d1b2e] transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0E5AA7] hover:bg-[#0a4a8a] disabled:opacity-60 text-white font-black py-4 rounded-xl transition-all text-sm mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : "Sign In to Admin"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-[#f0f4f9] rounded-xl">
              <p className="text-xs text-[#6b7897] font-semibold mb-1">Demo credentials</p>
              <p className="text-xs text-[#0d1b2e] font-mono">admin@lflmi.org / password123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[#6b7897] text-xs mt-6">
          <a href="/" className="hover:text-[#0E5AA7] transition-colors font-semibold">← Back to Public Site</a>
        </p>
      </div>
    </div>
  );
}
