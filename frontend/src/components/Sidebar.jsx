import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { categoryService } from "../services/catalogService";
import CategoryIcon from "./CategoryIcon";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => {});
  }, []);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="card p-3 sticky top-20">
        <div className="flex items-center gap-2 px-2 py-2 mb-1 text-brand-950 font-bold text-sm">
          <LayoutGrid size={17} />
          Barcha kategoriyalar
        </div>
        <nav className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                slug === c.slug
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand-700"
              }`}
            >
              <CategoryIcon slug={c.slug} icon={c.icon} size={17} />
              {c.name}
            </Link>
          ))}
          {categories.length === 0 &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 mx-2.5 my-1 rounded skeleton" />
            ))}
        </nav>
      </div>
    </aside>
  );
}
