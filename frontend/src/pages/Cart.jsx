import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatSom } from "../utils/format";

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];

  const subtotal = items.reduce((s, i) => s + Number(i.product_detail?.price || 0) * i.quantity, 0);
  const delivery = subtotal > 0 ? 25000 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <ShoppingBag size={48} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Savatchangiz bo'sh</p>
        <Link to="/products" className="btn-primary">Xarid qilishni boshlash</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-brand-950 mb-5">Savatcha ({items.length} ta mahsulot)</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="card p-3 flex items-center gap-3">
              <Link to={`/products/${item.product_detail?.slug}`} className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                {item.product_detail?.main_image && (
                  <img src={item.product_detail.main_image} alt="" className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_detail?.slug}`} className="font-medium text-sm text-brand-950 line-clamp-1">
                  {item.product_detail?.name}
                </Link>
                <p className="text-sm font-bold text-brand-700 mt-1">{formatSom(item.product_detail?.price)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-30"
                >
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center"
                >
                  <Plus size={13} />
                </button>
              </div>
              <p className="w-24 text-right font-bold text-sm text-brand-950 shrink-0 hidden sm:block">
                {formatSom(item.subtotal)}
              </p>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 shrink-0">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
          <Link to="/products" className="text-sm font-medium text-brand-600 flex items-center gap-1 mt-1">
            <ArrowLeft size={15} /> Xaridni davom ettirish
          </Link>
        </div>

        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-bold text-brand-950 mb-4">Buyurtma xulosasi</h2>
          <div className="flex flex-col gap-2 text-sm mb-4">
            <div className="flex justify-between text-gray-500">
              <span>Mahsulotlar narxi</span>
              <span>{formatSom(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Yetkazib berish</span>
              <span>{formatSom(delivery)}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-950 text-base pt-2 border-t border-gray-100">
              <span>Jami</span>
              <span>{formatSom(total)}</span>
            </div>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary w-full">
            Buyurtmani rasmiylashtirish
          </button>
        </div>
      </div>
    </div>
  );
}
