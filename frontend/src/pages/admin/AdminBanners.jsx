import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminBannerService } from "../../services/adminService";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";

const emptyForm = { title: "", subtitle: "", link: "", active: true, order: 0, image: null };

export default function AdminBanners() {
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminBannerService.list().then(setBanners).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle || "", link: b.link || "", active: b.active, order: b.order, image: null });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("link", form.link);
      fd.append("active", form.active);
      fd.append("order", form.order);
      if (form.image) fd.append("image", form.image);

      if (editing) {
        await adminBannerService.update(editing.id, fd);
        toast?.push("Banner yangilandi");
      } else {
        if (!form.image) { toast?.push("Rasm tanlang", "error"); setSaving(false); return; }
        await adminBannerService.create(fd);
        toast?.push("Banner qo'shildi");
      }
      setModalOpen(false);
      load();
    } catch {
      toast?.push("Xatolik yuz berdi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (b) => {
    if (!confirm(`"${b.title}" bannerini o'chirishni tasdiqlaysizmi?`)) return;
    await adminBannerService.remove(b.id);
    toast?.push("Banner o'chirildi", "info");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-brand-950">Bannerlar</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Yangi banner
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Yuklanmoqda...</p>
      ) : banners.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Banner topilmadi</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="card overflow-hidden">
              <div className="h-32 bg-gray-100">
                {b.image && <img src={b.image} className="w-full h-full object-cover" alt="" />}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-brand-950 truncate">{b.title}</p>
                <p className="text-xs text-gray-400 truncate mb-2">{b.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.active ? "Faol" : "Nofaol"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(b)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(b)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Bannerni tahrirlash" : "Yangi banner"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="label">Sarlavha</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Qo'shimcha matn</label>
            <input className="input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div>
            <label className="label">Havola (ixtiyoriy)</label>
            <input className="input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/category/telefonlar" />
          </div>
          <div>
            <label className="label">Tartib raqami</label>
            <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </div>
          <div>
            <label className="label">Rasm {editing && "(o'zgartirmasangiz bo'sh qoldiring)"}</label>
            <input type="file" accept="image/*" className="input" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-brand-600" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Faol
          </label>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
        </form>
      </Modal>
    </div>
  );
}
