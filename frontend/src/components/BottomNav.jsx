import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "../context/CartContext";

const tabs = [
  { to: "/", label: "Bosh sahifa", icon: Home, end: true },
  { to: "/products", label: "Kategoriya", icon: LayoutGrid },
  { to: "/cart", label: "Savatcha", icon: ShoppingCart },
  { to: "/favorites", label: "Sevimli", icon: Heart },
  { to: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const { itemCount } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex lg:hidden">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium relative ${
              isActive ? "text-brand-600" : "text-gray-400"
            }`
          }
        >
          <div className="relative">
            <Icon size={20} />
            {to === "/cart" && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
          </div>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
