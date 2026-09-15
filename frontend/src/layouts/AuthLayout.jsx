import { Link, Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-brand-500 rounded-lg p-2">
            <ShoppingBag size={22} className="text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            Savdo <span className="text-brand-300">Market</span>
          </span>
        </Link>
        <div className="card p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
