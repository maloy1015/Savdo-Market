import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      toast?.push("Xush kelibsiz!");
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || "Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-950 mb-1 flex items-center gap-2">
        <LogIn size={20} className="text-brand-600" /> Kirish
      </h1>
      <p className="text-sm text-gray-500 mb-6">Hisobingizga kiring va xaridni davom ettiring</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Email yoki telefon</label>
          <input
            className="input"
            required
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
            placeholder="email@mail.com yoki +998901234567"
          />
        </div>
        <div>
          <label className="label">Parol</label>
          <input
            type="password"
            className="input"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-1">
          {loading ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Hisobingiz yo'qmi?{" "}
        <Link to="/register" className="text-brand-600 font-semibold hover:underline">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  );
}
