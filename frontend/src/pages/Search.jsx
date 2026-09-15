import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import ProductList from "./ProductList";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-5 md:hidden">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="input pr-10"
            autoFocus
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon size={18} />
          </button>
        </div>
      </form>
      {searchParams.get("q") ? (
        <ProductList mode="search" />
      ) : (
        <div className="text-center text-gray-400 py-16">Qidiruv uchun so'z kiriting</div>
      )}
    </div>
  );
}
