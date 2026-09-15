import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus } from "lucide-react";
import { productService, reviewService } from "../services/catalogService";
import { formatSom } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";

const COLORS = ["#101a4d", "#8fb6ff", "#f472b6", "#34d399", "#fbbf24"];

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isFavorited, toggleFavorite } = useFavorites();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [colorIdx, setColorIdx] = useState(0);
  const [tab, setTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [related, setRelated] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await productService.detail(slug);
        setProduct(data);
        setActiveImage(0);
        const rel = await productService.list({ category: data.category?.slug, page_size: 5 });
        setRelated((rel.results || []).filter((p) => p.id !== data.id));
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-gray-400">Yuklanmoqda...</div>;
  }
  if (!product) {
    return <div className="py-24 text-center text-gray-400">Mahsulot topilmadi</div>;
  }

  const images = [product.main_image, ...(product.images || []).map((i) => i.image)].filter(Boolean);
  const favorited = isFavorited(product.id);

  const handleAddToCart = () => addToCart(product.id, quantity);
  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    toast?.push("Xaridni yakunlash uchun savatchaga o'ting");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast?.push("Sharh qoldirish uchun tizimga kiring", "error");
      return;
    }
    try {
      await reviewService.create({ product: product.id, ...reviewForm });
      toast?.push("Sharhingiz uchun rahmat!");
      const data = await productService.detail(slug);
      setProduct(data);
      setReviewForm({ rating: 5, comment: "" });
    } catch {
      toast?.push("Xatolik yuz berdi", "error");
    }
  };

  return (
    <div>
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-brand-600">Bosh sahifa</Link> /
        <Link to={`/category/${product.category?.slug}`} className="hover:text-brand-600">{product.category_name}</Link> /
        <span className="text-brand-950">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Gallery */}
        <div>
          <div className="card aspect-square overflow-hidden mb-3 flex items-center justify-center">
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full skeleton" />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                    i === activeImage ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-brand-950 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating}</span>
            </div>
            <span className="text-gray-400">({product.review_count} sharh)</span>
            <span className={`font-medium ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
              {product.stock > 0 ? "Mavjud" : "Tugagan"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl md:text-3xl font-extrabold text-brand-950">{formatSom(product.price)}</span>
            {product.old_price && Number(product.old_price) > Number(product.price) && (
              <>
                <span className="text-base text-gray-400 line-through">{formatSom(product.old_price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{product.discount}%</span>
              </>
            )}
          </div>

          <div className="mb-5">
            <span className="label">Rang</span>
            <div className="flex gap-2">
              {COLORS.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setColorIdx(i)}
                  className={`w-8 h-8 rounded-full border-2 ${colorIdx === i ? "border-brand-500" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <span className="label">Miqdor</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-brand-400"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-brand-400"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <ShoppingCart size={17} /> Savatchaga qo'shish
            </button>
            <button onClick={handleBuyNow} className="btn-outline flex-1 border-brand-600 text-brand-700 font-semibold">
              Hozir sotib olish
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center hover:border-red-300"
            >
              <Heart size={18} className={favorited ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600"><Truck size={16} className="text-brand-600" /> 1-3 kun ichida yetkazib beriladi</div>
            <div className="flex items-center gap-2 text-gray-600"><ShieldCheck size={16} className="text-brand-600" /> 12 oy rasmiy kafolat</div>
            <div className="flex items-center gap-2 text-gray-600"><RotateCcw size={16} className="text-brand-600" /> 14 kun ichida qaytarish mumkin</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-5 md:p-6 mb-10">
        <div className="flex gap-6 border-b border-gray-100 mb-5">
          {[
            ["description", "Tavsif"],
            ["specs", "Texnik xususiyatlar"],
            ["reviews", `Sharhlar (${product.review_count})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === key ? "border-brand-600 text-brand-700" : "border-transparent text-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "description" && (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description || "Tavsif mavjud emas."}
          </p>
        )}

        {tab === "specs" && (
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {product.specs && Object.keys(product.specs).length > 0 ? (
              Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 py-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-brand-950">{String(v)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Texnik xususiyatlar kiritilmagan.</p>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div>
            <form onSubmit={submitReview} className="mb-6 flex flex-col gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewForm((f) => ({ ...f, rating: r }))}
                  >
                    <Star size={20} className={r <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                  </button>
                ))}
              </div>
              <textarea
                className="input"
                rows={3}
                placeholder="Sharhingizni yozing..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              />
              <button type="submit" className="btn-primary w-fit">Sharh qoldirish</button>
            </form>

            <div className="flex flex-col gap-4">
              {(product.reviews || []).length === 0 && (
                <p className="text-gray-400 text-sm">Hozircha sharhlar yo'q.</p>
              )}
              {(product.reviews || []).map((r) => (
                <div key={r.id} className="border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-brand-950">{r.user_name}</span>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-brand-950 mb-3">O'xshash mahsulotlar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
