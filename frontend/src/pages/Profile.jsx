import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef();
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateProfile(form);
      setUser(updated);
      toast?.push("Profil yangilandi");
    } catch {
      toast?.push("Xatolik yuz berdi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await authService.uploadAvatar(file);
      setUser(updated);
      toast?.push("Rasm yangilandi");
    } catch {
      toast?.push("Rasm yuklashda xatolik", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
      <div className="card p-4 sm:p-5 flex flex-row lg:flex-col items-center gap-4 lg:gap-3 lg:h-fit lg:w-56 lg:shrink-0">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-brand-100 overflow-hidden flex items-center justify-center shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl sm:text-2xl font-bold text-brand-600">{user?.username?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 lg:flex-none min-w-0">
          <p className="font-semibold text-sm text-brand-950 truncate lg:hidden mb-2">{user?.username}</p>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline text-xs sm:text-sm flex items-center gap-1.5 w-fit">
            <Camera size={14} /> {uploading ? "Yuklanmoqda..." : "Rasm qo'shish"}
          </button>
        </div>
      </div>

      <div className="card p-4 sm:p-5 flex-1 min-w-0">
        <h2 className="font-bold text-brand-950 mb-4 text-sm sm:text-base">Profil ma'lumotlari</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="label">Ism</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-fit">
            {saving ? "Saqlanmoqda..." : "Tahrirlash"}
          </button>
        </form>
      </div>
    </div>
  );
}