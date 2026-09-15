import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { adminCategoryService } from "../../services/adminService";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";
import CategoryIcon from "../../components/CategoryIcon";

const emptyForm = { name: "", icon: "", order: 0, is_active: true, image: null };

export default function AdminCategories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminCategoryService.list().then(setCategories).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, icon: c.icon || "", order: c.order, is_active: c.is_active, image: null });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("icon", form.icon);
      fd.append("order", form.order);
      fd.append("is_active", form.is_active);
      if (form.image) fd.append("image", form.image);

      if (editing) {
        await adminCategoryService.update(editing.id, fd);
        toast?.push("Kategoriya yangilandi");
      } else {
        await adminCategoryService.create(fd);
        toast?.push("Kategoriya qo'shildi");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast?.push(err.response?.data?.name?.[0] || "Xatolik yuz berdi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`"${c.name}" kategoriyasini o'chirishni tasdiqlaysizmi?`)) return;
    await adminCategoryService.remove(c.id);
    toast?.push("Kategoriya o'chirildi", "info");
    load();
  };

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-brand-950">Kategoriyalar</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Yangi kategoriya
        </button>
      </div>

      <div className="card p-4 mb-4">
        <div className="relative max-w-xs">
          <input className="input pl-9" placeholder="Qidirish..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">Rasm</th>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Tartib</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Yuklanmoqda...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Kategoriya topilmadi</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center overflow-hidden">
                      {c.image ? <img src={c.image} className="w-full h-full object-cover" alt="" /> : <CategoryIcon slug={c.slug} icon={c.icon} className="text-brand-600" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-950">{c.name}</td>
                  <td className="px-4 py-3 text-gray-400">{c.slug}</td>
                  <td className="px-4 py-3">{c.order}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.is_active ? "Faol" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand-600 mr-3"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(c)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="label">Nomi</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Icon nomi (ixtiyoriy, masalan: smartphone)</label>
            <input className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          </div>
          <div>
            <label className="label">Tartib raqami</label>
            <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </div>
          <div>
            <label className="label">Rasm</label>
            <input type="file" accept="image/*" className="input" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-brand-600" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Faol
          </label>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
        </form>
      </Modal>
    </div>
  );
}
