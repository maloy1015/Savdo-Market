import { useEffect, useState } from "react";
import { Search, ShieldCheck, ShieldOff, UserX, UserCheck } from "lucide-react";
import { adminUserService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = () => {
    setLoading(true);
    adminUserService.list().then((data) => setUsers(data.results || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleToggleActive = async (u) => {
    const updated = await adminUserService.toggleActive(u.id);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    toast?.push(updated.is_active ? "Foydalanuvchi faollashtirildi" : "Foydalanuvchi bloklandi");
  };

  const handleToggleStaff = async (u) => {
    const updated = await adminUserService.toggleStaff(u.id);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    toast?.push(updated.is_staff ? "Admin huquqi berildi" : "Admin huquqi olib tashlandi");
  };

  const filtered = users.filter(
    (u) => u.username?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-950 mb-5">Foydalanuvchilar ({users.length})</h1>

      <div className="card p-4 mb-4">
        <div className="relative max-w-xs">
          <input className="input pl-9" placeholder="Ism yoki email qidirish..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">Foydalanuvchi</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Ro'yxatdan o'tgan</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Yuklanmoqda...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Foydalanuvchi topilmadi</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 flex items-center gap-2 font-medium text-brand-950">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 overflow-hidden">
                      {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" alt="" /> : u.username?.[0]?.toUpperCase()}
                    </div>
                    {u.username}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.date_joined).toLocaleDateString("uz-UZ")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.is_staff ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-500"}`}>
                      {u.is_staff ? "Admin" : "Mijoz"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {u.is_active ? "Faol" : "Bloklangan"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== currentUser?.id && (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleToggleStaff(u)} title="Admin huquqi" className="text-gray-400 hover:text-brand-600">
                          {u.is_staff ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button onClick={() => handleToggleActive(u)} title="Blok/faollashtirish" className="text-gray-400 hover:text-red-500">
                          {u.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
