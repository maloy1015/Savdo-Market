import { NavLink, Outlet } from "react-router-dom";
import { User, MapPin, Package, CreditCard, Heart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/profile", label: "Profil", icon: User, end: true },
  { to: "/profile/addresses", label: "Manzil", icon: MapPin },
  { to: "/profile/orders", label: "Buyurtmalarim", icon: Package },
  { to: "/profile/payment", label: "To'lov usullari", icon: CreditCard },
  { to: "/favorites", label: "Sevimlilar", icon: Heart },
];

export default function ProfileLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="md:grid md:grid-cols-[220px_1fr] md:gap-5 md:items-start">
      {/* Mobile: user summary bar */}
      <div className="card p-3 flex items-center gap-3 mb-3 md:hidden">
        <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-brand-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-brand-950 truncate">{user?.username}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <button onClick={logout} className="text-red-500 shrink-0 p-2 -mr-1" aria-label="Chiqish">
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile: horizontally scrollable tab bar */}
      <div className="md:hidden -mx-3 px-3 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-thin">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 snap-start transition-colors ${
                  isActive ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-600"
                }`
              }
            >
              <Icon size={13} /> {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="card p-3 h-fit sticky top-20 hidden md:block">
        <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-gray-50">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-brand-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-brand-950 truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
          <button onClick={logout} className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 whitespace-nowrap text-left">
            <LogOut size={16} /> Chiqish
          </button>
        </nav>
      </div>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}