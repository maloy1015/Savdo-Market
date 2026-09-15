import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Banknote, CheckCircle2, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { addressService, orderService } from "../services/shopService";
import { formatSom } from "../utils/format";
import { useToast } from "../context/ToastContext";
import LiveMap from "../components/LiveMap";
import { BankCardIcon, CashIcon, ClickIcon, PaymeIcon, CardBrandsRow } from "../components/PaymentIcons";

const REGIONS = [
  "Toshkent shahri", "Toshkent viloyati", "Andijon", "Farg'ona", "Namangan",
  "Samarqand", "Buxoro", "Xorazm", "Qashqadaryo", "Surxondaryo",
  "Navoiy", "Jizzax", "Sirdaryo", "Qoraqalpog'iston",
];

const PAYMENT_METHODS = [
  { value: "card", label: "Bank kartasi orqali to'lov", Icon: BankCardIcon, desc: "UzCard, Humo, Visa, Mastercard" },
  { value: "cash", label: "Naqd to'lov", Icon: CashIcon, desc: "Yetkazib berilganda" },
  { value: "payme", label: "Payme", Icon: PaymeIcon, desc: "Payme ilovasi orqali" },
  { value: "click", label: "Click", Icon: ClickIcon, desc: "Click ilovasi orqali" },
];

const steps = ["Manzil", "To'lov", "Tasdiqlash"];

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    region: "Toshkent shahri", city: "", district: "", address: "", phone: "", latitude: null, longitude: null,
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const items = cart.items || [];
  const subtotal = items.reduce((s, i) => s + Number(i.product_detail?.price || 0) * i.quantity, 0);
  const delivery = subtotal > 0 ? 25000 : 0;
  const total = subtotal + delivery;

  useEffect(() => {
    addressService.list().then(setSavedAddresses).catch(() => {});
  }, []);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const fullAddress = `${address.region}, ${address.city}, ${address.district}, ${address.address}`;
      await orderService.create({
        delivery_address: fullAddress,
        phone: address.phone,
        payment_method: paymentMethod,
        latitude: address.latitude,
        longitude: address.longitude,
      });
      await clearCart();
      toast?.push("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
      navigate("/profile/orders");
    } catch (e) {
      toast?.push(e.response?.data?.detail || "Buyurtma berishda xatolik", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    done ? "bg-emerald-500 text-white" : active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {done ? <Check size={16} /> : n}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${active ? "text-brand-950" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {n < steps.length && <div className="w-8 md:w-16 h-0.5 bg-gray-200" />}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 md:p-6">
          {step === 1 && (
            <div>
              <h2 className="font-bold text-brand-950 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-brand-600" /> Yetkazib berish manzili
              </h2>

              {savedAddresses.length > 0 && (
                <div className="flex flex-col gap-2 mb-5">
                  {savedAddresses.map((a) => (
                    <button
                      key={a.id}
                      onClick={() =>
                        setAddress({ region: a.region, city: a.city, district: a.district, address: a.address, phone: address.phone })
                      }
                      className="text-left border border-gray-200 hover:border-brand-400 rounded-xl px-4 py-3 text-sm"
                    >
                      {a.region}, {a.city}, {a.district}, {a.address}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Viloyat</label>
                  <select className="input" value={address.region} onChange={(e) => setAddress({ ...address, region: e.target.value })}>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Shahar / Tuman</label>
                  <input className="input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Toshkent shahri" />
                </div>
                <div>
                  <label className="label">Manzil</label>
                  <input className="input" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} placeholder="Chilonzor tumani, Navro'z ko'chasi 12" />
                </div>
                <div>
                  <label className="label">Qo'shimcha ma'lumot (ixtiyoriy)</label>
                  <input className="input" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} placeholder="Dom oldida" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Telefon raqam</label>
                  <input className="input" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+998 90 123 45 67" />
                </div>
              </div>

              <div className="mt-5">
                <label className="label mb-2 block">Manzilni xaritada belgilash</label>
                <LiveMap
                  value={address.latitude ? { lat: address.latitude, lng: address.longitude } : null}
                  onChange={({ lat, lng, label }) =>
                    setAddress((a) => ({ ...a, latitude: lat, longitude: lng, address: a.address || label }))
                  }
                  height={240}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!address.city || !address.address || !address.phone}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                Davom etish
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-bold text-brand-950 mb-4">To'lov usuli</h2>
              <div className="flex flex-col gap-2.5">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.Icon;
                  return (
                    <label
                      key={m.value}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors ${
                        paymentMethod === m.value ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-300"
                      }`}
                    >
                      <input type="radio" name="payment" className="accent-brand-600" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                      <Icon size={26} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-950">{m.label}</p>
                        {m.desc && <p className="text-xs text-gray-500">{m.desc}</p>}
                      </div>
                    </label>
                  );
                })}
              </div>
              {paymentMethod === "card" && (
                <div className="mt-3">
                  <CardBrandsRow size={22} />
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Orqaga</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Davom etish</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-bold text-brand-950 mb-4">Buyurtmani tasdiqlash</h2>
              <div className="flex flex-col gap-3 text-sm mb-5">
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Manzil</span>
                  <span className="font-medium text-right max-w-[60%]">{address.region}, {address.city}, {address.address}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Telefon</span>
                  <span className="font-medium">{address.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">To'lov usuli</span>
                  <span className="font-medium">{PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">Orqaga</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <CheckCircle2 size={17} /> {placing ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-5 h-fit">
          <h2 className="font-bold text-brand-950 mb-4">Buyurtma ({items.length} ta)</h2>
          <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5 text-sm">
                <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                  {item.product_detail?.main_image && <img src={item.product_detail.main_image} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 font-medium text-brand-950">{item.product_detail?.name}</p>
                  <p className="text-gray-400 text-xs">x{item.quantity}</p>
                </div>
                <span className="font-semibold shrink-0">{formatSom(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm pt-3 border-t border-gray-100">
            <div className="flex justify-between text-gray-500"><span>Mahsulotlar</span><span>{formatSom(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Yetkazib berish</span><span>{formatSom(delivery)}</span></div>
            <div className="flex justify-between font-bold text-brand-950 text-base pt-2 border-t border-gray-100">
              <span>Jami</span><span>{formatSom(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
