import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    first_name: "", email: "", phone: "", password: "", password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast?.push("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-950 mb-1 flex items-center gap-2">
        <UserPlus size={20} className="text-brand-600" /> Ro'yxatdan o'tish
      </h1>
      <p className="text-sm text-gray-500 mb-6">Bir necha soniyada hisob yarating</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Ism</label>
          <input className="input" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Ismingiz" />
          {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name[0]}</p>}
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@mail.com" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
        </div>
        <div>
          <label className="label">Telefon</label>
          <input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998901234567" />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone[0]}</p>}
        </div>
        <div>
          <label className="label">Parol</label>
          <input type="password" className="input" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Kamida 6 ta belgi" />
        </div>
        <div>
          <label className="label">Parolni tasdiqlang</label>
          <input type="password" className="input" required value={form.password_confirm} onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} placeholder="••••••••" />
          {errors.password_confirm && <p className="text-xs text-red-500 mt-1">{errors.password_confirm[0]}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-1">
          {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Hisobingiz bormi?{" "}
        <Link to="/login" className="text-brand-600 font-semibold hover:underline">Kirish</Link>
      </p>
    </div>
  );
}
