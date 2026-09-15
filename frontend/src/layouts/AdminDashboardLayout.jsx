import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, LayoutGrid, ShoppingBag,
  CreditCard, Image, MessageSquare, MapPin, BarChart3, Settings, ShoppingBag as Logo,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin-dashboard/users", label: "Foydalanuvchilar", icon: Users },
  { to: "/admin-dashboard/products", label: "Mahsulotlar", icon: Package },
  { to: "/admin-dashboard/categories", label: "Kategoriyalar", icon: LayoutGrid },
  { to: "/admin-dashboard/orders", label: "Buyurtmalar", icon: ShoppingBag },
  { to: "/admin-dashboard/payments", label: "To'lovlar", icon: CreditCard },
  { to: "/admin-dashboard/banners", label: "Bannerlar", icon: Image },
  { to: "/admin-dashboard/reviews", label: "Sharhlar", icon: MessageSquare },
  { to: "/admin-dashboard/addresses", label: "Manzillar", icon: MapPin },
  { to: "/admin-dashboard/analytics", label: "Statistika", icon: BarChart3 },
  { to: "/admin-dashboard/settings", label: "Sozlamalar", icon: Settings },
];

export default function AdminDashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="py-24 text-center text-gray-400">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_staff) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex">
      <aside className="w-60 shrink-0 bg-brand-950 text-white/80 hidden md:flex flex-col">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
          <div className="bg-brand-500 rounded-lg p-1.5"><Logo size={16} /></div>
          <span className="font-bold text-white text-sm">Savdo Market Admin</span>
        </div>
        <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-600 text-white" : "hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6">
          <span className="font-bold text-brand-950 md:hidden">Admin</span>
          <div className="flex items-center gap-2 ml-auto text-sm font-medium text-brand-950">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
              {user.username?.[0]?.toUpperCase()}
            </div>
            {user.username} (Admin)
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
