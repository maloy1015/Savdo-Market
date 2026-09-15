import { ExternalLink } from "lucide-react";

export default function AdminPlaceholder({ title }) {
  const djangoAdminUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace("/api", "/admin/");

  return (
    <div className="card p-8 flex flex-col items-center text-center gap-3">
      <h1 className="text-lg font-bold text-brand-950">{title}</h1>
      <p className="text-sm text-gray-500 max-w-md">
        To'liq CRUD boshqaruvi (qo'shish, tahrirlash, o'chirish, qidirish, filter) hozircha Django Admin panel orqali amalga oshiriladi.
      </p>
      <a href={djangoAdminUrl} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2">
        Django Admin'ni ochish <ExternalLink size={15} />
      </a>
    </div>
  );
}
