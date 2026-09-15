import { useEffect, useState } from "react";
import { adminOrderService } from "../../services/adminService";
import { formatSom } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

const STATUS_OPTIONS = [
  { value: "pending", label: "Yangi", color: "bg-amber-100 text-amber-700" },
  { value: "processing", label: "Tayyorlanmoqda", color: "bg-blue-100 text-blue-700" },
  { value: "shipped", label: "Yetkazilmoqda", color: "bg-indigo-100 text-indigo-700" },
  { value: "delivered", label: "Yetkazildi", color: "bg-emerald-100 text-emerald-700" },
  { value: "cancelled", label: "Bekor qilingan", color: "bg-red-100 text-red-700" },
];

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const load = () => {
    setLoading(true);
    adminOrderService.list().then((data) => setOrders(data.results || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (order, status) => {
    try {
      await adminOrderService.updateStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      toast?.push("Holat yangilandi");
    } catch {
      toast?.push("Xatolik yuz berdi", "error");
    }
  };

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-brand-950">Buyurtmalar ({orders.length})</h1>
        <select className="input w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Barchasi</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Foydalanuvchi</th>
              <th className="px-4 py-3">Mahsulotlar</th>
              <th className="px-4 py-3">Summa</th>
              <th className="px-4 py-3">To'lov</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Sana</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Yuklanmoqda...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Buyurtma topilmadi</td></tr>
            ) : (
              filtered.map((o) => {
                const status = STATUS_OPTIONS.find((s) => s.value === o.status) || STATUS_OPTIONS[0];
                return (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-brand-950">#{o.id}</td>
                    <td className="px-4 py-3">{o.user_name || o.user}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                      {o.items?.map((i) => i.product_name).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatSom(o.total_price)}</td>
                    <td className="px-4 py-3 text-gray-500 uppercase text-xs">{o.payment_method}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 ${status.color}`}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString("uz-UZ")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
