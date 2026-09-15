import { ShoppingBag, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white/80 mt-10 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-brand-500 rounded-lg p-1.5">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-lg text-white">Savdo Market</span>
          </div>
          <p className="text-white/50 leading-relaxed">
            O'zbekistondagi eng qulay va ishonchli onlayn market. Minglab mahsulotlar, tez yetkazib berish.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Mijozlarga</h4>
          <ul className="space-y-2 text-white/50">
            <li><a href="#" className="hover:text-white">Buyurtmalarim</a></li>
            <li><a href="#" className="hover:text-white">Qaytarish shartlari</a></li>
            <li><a href="#" className="hover:text-white">Yetkazib berish</a></li>
            <li><a href="#" className="hover:text-white">Ko'p so'raladigan savollar</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Kompaniya</h4>
          <ul className="space-y-2 text-white/50">
            <li><a href="#" className="hover:text-white">Biz haqimizda</a></li>
            <li><a href="#" className="hover:text-white">Hamkorlik</a></li>
            <li><a href="#" className="hover:text-white">Vakansiyalar</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Aloqa</h4>
          <ul className="space-y-2 text-white/50">
            <li className="flex items-center gap-2"><Phone size={14} /> +998 71 200 00 00</li>
            <li className="flex items-center gap-2"><Mail size={14} /> info@savdomarket.uz</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Toshkent, O'zbekiston</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Savdo Market. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
