import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { adminProductService, adminCategoryService } from "../../services/adminService";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";
import { useToast } from "../../context/ToastContext";
import { formatSom } from "../../utils/format";

const emptyForm = {
  name: "", category: "", price: "", old_price: "", stock: 0, brand: "",
  description: "", is_active: true, is_featured: false, is_new: false, is_deal_of_day: false, main_image: null,
};

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminProductService.list({ page, search: query || undefined })
      .then((data) => { setProducts(data.results || []); setCount(data.count || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { adminCategoryService.list().then(setCategories); }, []);
  useEffect(load, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.id || "" });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, price: p.price, old_price: p.old_price || "",
      stock: p.stock, brand: p.brand || "", description: p.description || "",
      is_active: p.is_active !== false, is_featured: !!p.is_featured, is_new: !!p.is_new,
      is_deal_of_day: !!p.is_deal_of_day, main_image: null,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v === null || v === "") return;
        fd.append(k, v);
      });
      if (editing) {
        await adminProductService.update(editing.slug, fd);
        toast?.push("Mahsulot yangilandi");
      } else {
        await adminProductService.create(fd);
        toast?.push("Mahsulot qo'shildi");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      const data = err.response?.data;
      toast?.push(data ? Object.values(data)[0]?.[0] || "Xatolik" : "Xatolik yuz berdi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`"${p.name}" mahsulotini o'chirishni tasdiqlaysizmi?`)) return;
    await adminProductService.remove(p.slug);
    toast?.push("Mahsulot o'chirildi", "info");
    load();
  };

  const pageCount = Math.max(Math.ceil(count / 12), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-brand-950">Mahsulotlar ({count})</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Yangi mahsulot
        </button>
      </div>

      <form onSubmit={handleSearch} className="card p-4 mb-4">
        <div className="relative max-w-xs">
          <input className="input pl-9" placeholder="Mahsulot qidirish..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">Rasm</th>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Narx</th>
              <th className="px-4 py-3">Qoldiq</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Yuklanmoqda...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Mahsulot topilmadi</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden">
                      {p.main_image && <img src={p.main_image} className="w-full h-full object-cover" alt="" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-950 max-w-[220px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category_name}</td>
                  <td className="px-4 py-3 font-semibold">{formatSom(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.is_active !== false ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_active !== false ? "Faol" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-brand-600 mr-3"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(p)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Mahsulotni tahrirlash" : "Yangi mahsulot"} size="lg">
        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Nomi</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Kategoriya</label>
            <select className="input" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Brand</label>
            <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div>
            <label className="label">Yangi narx</label>
            <input type="number" className="input" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="label">Eski narx (ixtiyoriy)</label>
            <input type="number" className="input" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} />
          </div>
          <div>
            <label className="label">Qoldiq</label>
            <input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div>
            <label className="label">Asosiy rasm</label>
            <input type="file" accept="image/*" className="input" onChange={(e) => setForm({ ...form, main_image: e.target.files[0] })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Tavsif</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-brand-600" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Faol
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-brand-600" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Mashhur
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-brand-600" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> Yangi
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-brand-600" checked={form.is_deal_of_day} onChange={(e) => setForm({ ...form, is_deal_of_day: e.target.checked })} /> Kun mahsuloti
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary sm:col-span-2">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
        </form>
      </Modal>
    </div>
  );
}
