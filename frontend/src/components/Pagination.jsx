import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:border-brand-400"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-gray-300">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
              p === page ? "bg-brand-600 text-white" : "border border-gray-200 hover:border-brand-400"
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:border-brand-400"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
