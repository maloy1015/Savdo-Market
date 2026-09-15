import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <PackageSearch size={48} className="text-gray-300" />
      <h1 className="text-2xl font-bold text-brand-950">404</h1>
      <p className="text-gray-500">Sahifa topilmadi</p>
      <Link to="/" className="btn-primary">Bosh sahifaga qaytish</Link>
    </div>
  );
}
