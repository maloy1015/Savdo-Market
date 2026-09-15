import { useEffect, useState } from "react";
import { MapPin, Trash2, Plus } from "lucide-react";
import { addressService } from "../services/shopService";
import { useToast } from "../context/ToastContext";
import LiveMap from "../components/LiveMap";

const EMPTY = { region: "", city: "", district: "", address: "", latitude: null, longitude: null };

export default function ProfileAddresses() {
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => addressService.list().then(setAddresses);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addressService.create(form);
    setForm(EMPTY);
    setShowForm(false);
    toast?.push("Manzil qo'shildi");
    load();
  };

  const handleRemove = async (id) => {
    await addressService.remove(id);
    toast?.push("Manzil o'chirildi", "info");
    load();
  };

  return (
    <div className="card w-full max-w-full overflow-hidden p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-brand-950">Manzillarim</h2>
        <button onClick={() => setShowForm((s) => !s)} className="btn-outline flex items-center justify-center gap-1.5 text-sm sm:w-auto w-full">
          <Plus size={15} /> Yangi manzil
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-5 flex flex-col gap-4 border-b border-gray-50 pb-5">
          <div className="min-w-0">
            <label className="label mb-2 block">Manzilni xaritadan tanlang</label>
            <LiveMap
              value={form.latitude ? { lat: form.latitude, lng: form.longitude } : null}
              onChange={({ lat, lng, label }) =>
                setForm((f) => ({ ...f, latitude: lat, longitude: lng, address: f.address || label }))
              }
              height={260}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input w-full" required placeholder="Viloyat" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            <input className="input w-full" required placeholder="Shahar" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input className="input w-full" required placeholder="Tuman" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
            <input className="input w-full" required placeholder="Manzil" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-fit">Saqlash</button>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Hali manzil qo'shilmagan</p>
      ) : (
        <div className="flex flex-col gap-2">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3">
              <MapPin size={16} className="shrink-0 text-brand-600" />
              <span className="flex-1 min-w-0 text-sm break-words">{a.region}, {a.city}, {a.district}, {a.address}</span>
              <button onClick={() => handleRemove(a.id)} className="shrink-0 text-gray-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
