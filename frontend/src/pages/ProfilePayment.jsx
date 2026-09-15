import { BankCardIcon, ClickIcon, PaymeIcon, CashIcon, CardBrandsRow } from "../components/PaymentIcons";

const METHODS = [
  { key: "card", label: "Bank kartasi", desc: "UzCard / Humo / Visa / MasterCard orqali to'lov", Icon: BankCardIcon, brands: true },
  { key: "click", label: "Click", desc: "Click ilovasi orqali tezkor to'lov", Icon: ClickIcon },
  { key: "payme", label: "Payme", desc: "Payme ilovasi orqali tezkor to'lov", Icon: PaymeIcon },
  { key: "cash", label: "Naqd to'lov", desc: "Buyurtma yetkazib berilganda naqd to'lash", Icon: CashIcon },
];

export default function ProfilePayment() {
  return (
    <div className="card w-full max-w-full overflow-hidden p-4 sm:p-5">
      <h2 className="mb-1 font-bold text-brand-950">To'lov usullari</h2>
      <p className="mb-5 text-sm text-gray-500">Checkout jarayonida shulardan birini tanlaysiz</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {METHODS.map((m) => (
          <div key={m.key} className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 px-4 py-4">
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-brand-50 p-2">
              <m.Icon size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-950">{m.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{m.desc}</p>
              {m.brands && <CardBrandsRow size={18} className="mt-2" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
