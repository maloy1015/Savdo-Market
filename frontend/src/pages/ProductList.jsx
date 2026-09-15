import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Pagination from "../components/Pagination";
import { productService } from "../services/catalogService";

export default function ProductList({ mode = "all" }) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    ordering: searchParams.get("ordering") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    min_rating: searchParams.get("min_rating") || "",
    brand: searchParams.get("brand") || "",
    has_discount: searchParams.get("has_discount") === "true",
  });

  const query = searchParams.get("q") || "";

  useEffect(() => {
    setPage(1);
  }, [slug, query, filters]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = { page, ...filters };
        if (mode === "category" && slug) params.category = slug;
        if (mode === "search") params.search = query;
        if (!params.has_discount) delete params.has_discount;

        const data = await productService.list(params);
        setProducts(data.results || []);
        setCount(data.count || 0);
      } catch {
        setProducts([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, slug, query, filters, page]);

  const pageSize = 12;
  const pageCount = Math.max(Math.ceil(count / pageSize), 1);

  const title =
    mode === "search" ? `"${query}" bo'yicha natijalar` : mode === "category" ? slug : "Barcha mahsulotlar";

  return (
    <div className="flex w-full flex-col gap-5 lg:flex-row">
      {/* Katta ekranda ko'rinadi, mobil/tabletda yashirin */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="mb-1 text-xl font-bold capitalize text-brand-950 md:text-2xl">{title}</h1>
        <p className="mb-4 text-sm text-gray-500">{count} ta mahsulot topildi</p>

        {/* Mobilda filtr tugmasi */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="mb-4 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium lg:hidden"
        >
          <SlidersHorizontal size={15} />
          Filtrlar
        </button>

        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Katta ekranda doim ko'rinadi */}
          <div className="hidden lg:block">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({ ordering: "", min_price: "", max_price: "", min_rating: "", brand: "", has_discount: false })
              }
            />
          </div>

          {/* Mobilda drawer sifatida */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-72 overflow-y-auto bg-white p-4">
                <ProductFilters
                  filters={filters}
                  onChange={(f) => {
                    setFilters(f);
                    setMobileFiltersOpen(false);
                  }}
                  onReset={() =>
                    setFilters({ ordering: "", min_price: "", max_price: "", min_rating: "", brand: "", has_discount: false })
                  }
                />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
                <PackageSearch size={40} className="text-gray-300" />
                <p className="font-medium text-gray-500">Hech qanday mahsulot topilmadi</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-4">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                <Pagination page={page} pageCount={pageCount} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}