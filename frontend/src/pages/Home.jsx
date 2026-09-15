import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Truck, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { productService, bannerService, categoryService } from "../services/catalogService";
import CategoryIcon from "../components/CategoryIcon";

function Section({ title, viewAllTo, children }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-bold text-brand-950">{title}</h2>
        {viewAllTo && (
          <Link to={viewAllTo} className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
            Barchasini ko'rish <ChevronRight size={15} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function ProductRow({ products, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [dealOfDay, setDealOfDay] = useState(null);
  const [fresh, setFresh] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [bannersData, categoriesData, featuredData, discountedData, freshData] = await Promise.all([
          bannerService.list().catch(() => []),
          categoryService.list().catch(() => []),
          productService.list({ ordering: "-review_count", page_size: 10 }).catch(() => ({ results: [] })),
          productService.list({ has_discount: true, page_size: 10 }).catch(() => ({ results: [] })),
          productService.list({ ordering: "-created_at", page_size: 5 }).catch(() => ({ results: [] })),
        ]);
        setBanners(bannersData);
        setCategories(categoriesData.slice(0, 8));
        setFeatured(featuredData.results || []);
        setDiscounted(discountedData.results || []);
        setDealOfDay((discountedData.results || [])[0] || null);
        setFresh(freshData.results || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex gap-5">
      <Sidebar />

      <div className="flex-1 min-w-0">
        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-900 via-brand-700 to-brand-500 text-white p-6 md:p-10 mb-6">
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 mb-3 opacity-90">
              <ShoppingBag size={20} />
              <span className="font-bold text-lg">Savdo Market</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3">
              {banners[0]?.title || "Siz izlagan barcha mahsulotlar bir joyda!"}
            </h1>
            {banners[0]?.subtitle && <p className="text-white/80 mb-5">{banners[0].subtitle}</p>}
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition">
              Xarid qilish <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 text-xs md:text-sm">
          <div className="card flex items-center gap-2 px-3 py-3">
            <Truck size={18} className="text-brand-600 shrink-0" />
            <span className="font-medium text-brand-950">Tez yetkazib berish</span>
          </div>
          <div className="card flex items-center gap-2 px-3 py-3">
            <ShieldCheck size={18} className="text-brand-600 shrink-0" />
            <span className="font-medium text-brand-950">100% sifat kafolati</span>
          </div>
          <div className="card flex items-center gap-2 px-3 py-3">
            <CreditCard size={18} className="text-brand-600 shrink-0" />
            <span className="font-medium text-brand-950">Qulay to'lov usullari</span>
          </div>
        </div>

        {/* Categories quick grid (mobile/tablet) */}
        <div className="lg:hidden mb-8">
          <h2 className="text-lg font-bold text-brand-950 mb-3">Kategoriyalar</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((c) => (
              <Link key={c.id} to={`/category/${c.slug}`} className="card flex flex-col items-center gap-1.5 py-3 px-1 text-center">
                <CategoryIcon slug={c.slug} icon={c.icon} size={20} className="text-brand-600" />
                <span className="text-[11px] font-medium text-gray-600 line-clamp-1">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <Section title="Mashhur mahsulotlar" viewAllTo="/products?ordering=-review_count">
          <ProductRow products={featured} loading={loading} />
        </Section>

        <Section title="Chegirmadagi mahsulotlar" viewAllTo="/products?has_discount=true">
          <ProductRow products={discounted} loading={loading} />
        </Section>

        {dealOfDay && (
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-brand-950 mb-3">Kun mahsuloti</h2>
            <Link to={`/products/${dealOfDay.slug}`} className="card flex flex-col md:flex-row overflow-hidden hover:shadow-soft transition-shadow">
              <div className="md:w-72 aspect-square md:aspect-auto bg-gray-50 shrink-0">
                {dealOfDay.main_image && (
                  <img src={dealOfDay.main_image} alt={dealOfDay.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-5 flex flex-col justify-center gap-2">
                <span className="inline-block w-fit bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  -{dealOfDay.discount}% chegirma
                </span>
                <h3 className="text-lg font-bold text-brand-950">{dealOfDay.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-brand-700">
                    {new Intl.NumberFormat("uz-UZ").format(dealOfDay.price)} so'm
                  </span>
                  {dealOfDay.old_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {new Intl.NumberFormat("uz-UZ").format(dealOfDay.old_price)} so'm
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        <Section title="Yangi mahsulotlar" viewAllTo="/products?ordering=-created_at">
          <ProductRow products={fresh} loading={loading} />
        </Section>
      </div>
    </div>
  );
}
