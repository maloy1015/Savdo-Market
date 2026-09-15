import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <Heart size={48} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Sevimlilar ro'yxati bo'sh</p>
        <Link to="/products" className="btn-primary">Mahsulotlarni ko'rish</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-brand-950 mb-5">Sevimlilar ({favorites.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {favorites.map((f) => f.product_detail && <ProductCard key={f.id} product={f.product_detail} />)}
      </div>
    </div>
  );
}
