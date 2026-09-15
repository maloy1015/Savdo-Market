import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { adminReviewService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function AdminReviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminReviewService.list().then(setReviews).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (r) => {
    if (!confirm("Bu sharhni o'chirishni tasdiqlaysizmi?")) return;
    await adminReviewService.remove(r.id);
    toast?.push("Sharh o'chirildi", "info");
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-950 mb-5">Sharhlar ({reviews.length})</h1>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Yuklanmoqda...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Sharhlar yo'q</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="card p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-brand-950">{r.user_name}</span>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("uz-UZ")}</span>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
              <button onClick={() => handleDelete(r)} className="text-gray-400 hover:text-red-500 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
