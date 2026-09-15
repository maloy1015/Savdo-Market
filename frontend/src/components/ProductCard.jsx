import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { formatSom } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
  };

  const handleFav = (e) => {
    e.preventDefault();
    toggleFavorite(product.id);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group relative w-full flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200"
    >
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          -{product.discount}%
        </span>
      )}
      <button
        onClick={handleFav}
        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur rounded-full p-1.5 shadow hover:scale-110 transition-transform"
      >
        <Heart size={16} className={favorited ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      <div className="w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
        {product.main_image ? (
          <img
            src={product.main_image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="text-sm font-medium text-brand-950 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-medium">{product.rating}</span>
          <span>({product.review_count})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className="text-base font-bold text-brand-950">{formatSom(product.price)}</span>
          {product.old_price && Number(product.old_price) > Number(product.price) && (
            <span className="text-xs text-gray-400 line-through">{formatSom(product.old_price)}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <ShoppingCart size={15} />
          Savatchaga qo'shish
        </button>
      </div>
    </Link>
  );
}