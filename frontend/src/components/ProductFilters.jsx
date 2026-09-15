import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "", label: "Standart" },
  { value: "price", label: "Arzon → Qimmat" },
  { value: "-price", label: "Qimmat → Arzon" },
  { value: "-created_at", label: "Yangi" },
  { value: "-review_count", label: "Mashhur" },
  { value: "-rating", label: "Reyting bo'yicha" },
];

export default function ProductFilters({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false);

  const update = (patch) => onChange({ ...filters, ...patch });

  const Body = (
    <div className="flex flex-col gap-5">
      <div>
        <label className="label">Narx oralig'i (so'm)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="dan"
            className="input"
            value={filters.min_price || ""}
            onChange={(e) => update({ min_price: e.target.value })}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="gacha"
            className="input"
            value={filters.max_price || ""}
            onChange={(e) => update({ max_price: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label">Minimal reyting</label>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => update({ min_rating: filters.min_rating === r ? "" : r })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                Number(filters.min_rating) === r
                  ? "bg-brand-600 text-white border-brand-600"
                  : "border-gray-200 text-gray-600 hover:border-brand-300"
              }`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Faqat chegirmali</label>
        <button
          onClick={() => update({ has_discount: !filters.has_discount })}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border ${
            filters.has_discount ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 text-gray-600"
          }`}
        >
          {filters.has_discount ? "✓ Chegirmadagilar" : "Chegirmadagilarni ko'rsat"}
        </button>
      </div>

      <div>
        <label className="label">Brand</label>
        <input
          type="text"
          placeholder="Masalan: Apple"
          className="input"
          value={filters.brand || ""}
          onChange={(e) => update({ brand: e.target.value })}
        />
      </div>

      <button onClick={onReset} className="btn-outline text-sm">Filtrlarni tozalash</button>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="btn-outline flex items-center gap-2 text-sm">
          <SlidersHorizontal size={16} /> Filtrlar
        </button>
        <select
          className="input w-auto"
          value={filters.ordering || ""}
          onChange={(e) => update({ ordering: e.target.value })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="hidden lg:block w-64 shrink-0">
        <div className="card p-4 sticky top-20">
          <div className="flex items-center gap-2 mb-4 font-bold text-brand-950">
            <SlidersHorizontal size={16} /> Filtrlar
          </div>
          <div className="mb-4">
            <label className="label">Saralash</label>
            <select
              className="input"
              value={filters.ordering || ""}
              onChange={(e) => update({ ordering: e.target.value })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {Body}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-brand-950">Filtrlar</span>
              <button onClick={() => setOpen(false)} className="text-gray-400">✕</button>
            </div>
            {Body}
            <button onClick={() => setOpen(false)} className="btn-primary w-full mt-4">Qo'llash</button>
          </div>
        </div>
      )}
    </>
  );
}
