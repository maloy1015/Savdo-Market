import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, LogIn, UserPlus, Menu, X, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { categoryService } from "../services/catalogService";
import CategoryIcon from "./CategoryIcon";

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (mobileOpen) {
      categoryService.list().then(setCategories).catch(() => {});
    }
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="h-16 flex items-center gap-3 md:gap-6">
          <button className="lg:hidden p-1.5" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-brand-500 rounded-lg p-1.5">
              <ShoppingBag size={18} />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Savdo <span className="text-brand-300">Market</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mahsulot qidirish..."
                className="w-full rounded-xl bg-white/10 placeholder-white/50 text-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white/15 transition"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                <Search size={18} />
              </button>
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-2 ml-auto">
            {!user ? (
              <>
                <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10">
                  <LogIn size={16} /> Kirish
                </Link>
                <Link to="/register" className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600">
                  <UserPlus size={16} /> Ro'yxatdan o'tish
                </Link>
              </>
            ) : (
              <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={16} />
                )}
                {user.username}
              </Link>
            )}
            <Link to="/favorites" className="p-2.5 rounded-lg hover:bg-white/10 relative">
              <Heart size={19} />
            </Link>
            <Link to="/cart" className="p-2.5 rounded-lg hover:bg-white/10 relative">
              <ShoppingCart size={19} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex md:hidden items-center gap-1 ml-auto">
            <Link to="/search" className="p-2"><Search size={20} /></Link>
            <Link to="/cart" className="p-2 relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white text-brand-950 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            {!user ? (
              <div className="flex flex-col gap-2 mb-4">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center">Kirish</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center">Ro'yxatdan o'tish</Link>
              </div>
            ) : (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-outline w-full mb-4">
                Chiqish
              </button>
            )}
            <div className="flex flex-col gap-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  <CategoryIcon slug={c.slug} icon={c.icon} className="text-brand-600" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
