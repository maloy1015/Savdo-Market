import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { orderService } from "../services/shopService";
import { formatSom } from "../utils/format";

const STATUS_LABELS = {
  pending: { label: "Yangi", color: "bg-amber-100 text-amber-700" },
  processing: { label: "Tayyorlanmoqda", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Yetkazilmoqda", color: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "Yetkazildi", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Bekor qilingan", color: "bg-red-100 text-red-700" },
};

export default function ProfileOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.list().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-16 text-center text-gray-400">Yuklanmoqda...</div>;

  if (orders.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Package size={40} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Sizda hali buyurtmalar yo'q</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => {
        const status = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
        return (
          <div key={o.id} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-brand-950">Buyurtma #{o.id}</p>
                <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString("uz-UZ")}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              {o.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  {item.product_image && <img src={item.product_image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                  <span className="flex-1 line-clamp-1">{item.product_name}</span>
                  <span className="text-gray-400">x{item.quantity}</span>
                  <span className="font-semibold">{formatSom(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-50 text-sm">
              <span className="text-gray-500">{o.delivery_address}</span>
              <span className="font-bold text-brand-950">{formatSom(o.total_price)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
