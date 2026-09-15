// Real payment-brand icons (icons8 CDN where available) + styled badges
// for local Uzbek payment systems that icons8 doesn't carry as exact logos.

const ICONS8 = {
  visa: "https://img.icons8.com/color/48/visa.png",
  mastercard: "https://img.icons8.com/color/48/mastercard-logo.png",
  mir: "https://img.icons8.com/color/48/mir-logo.png",
  bankCard: "https://img.icons8.com/fluency/48/bank-card-back-side.png",
  cash: "https://img.icons8.com/fluency/48/us-dollar-circulation.png",
};

export function VisaIcon({ size = 28, className = "" }) {
  return <img src={ICONS8.visa} width={size} height={size} alt="Visa" className={className} />;
}
export function MastercardIcon({ size = 28, className = "" }) {
  return <img src={ICONS8.mastercard} width={size} height={size} alt="Mastercard" className={className} />;
}
export function MirIcon({ size = 28, className = "" }) {
  return <img src={ICONS8.mir} width={size} height={size} alt="Mir" className={className} />;
}
export function BankCardIcon({ size = 28, className = "" }) {
  return <img src={ICONS8.bankCard} width={size} height={size} alt="Karta" className={className} />;
}
export function CashIcon({ size = 28, className = "" }) {
  return <img src={ICONS8.cash} width={size} height={size} alt="Naqd" className={className} />;
}

// Uzcard / Humo / Click / Payme brand wordmarks styled with their real brand colors
export function UzcardIcon({ size = 28 }) {
  return (
    <span style={{ height: size }} className="inline-flex items-center px-2 rounded-md bg-[#0a3d91] text-white text-[10px] font-extrabold tracking-tight leading-none">
      UZCARD
    </span>
  );
}
export function HumoIcon({ size = 28 }) {
  return (
    <span style={{ height: size }} className="inline-flex items-center px-2 rounded-md bg-gradient-to-r from-[#00a651] to-[#0072bc] text-white text-[10px] font-extrabold tracking-tight leading-none">
      HUMO
    </span>
  );
}
export function ClickIcon({ size = 28 }) {
  return (
    <span style={{ height: size }} className="inline-flex items-center px-2 rounded-md bg-[#00aeef] text-white text-[11px] font-extrabold italic leading-none">
      Click
    </span>
  );
}
export function PaymeIcon({ size = 28 }) {
  return (
    <span style={{ height: size }} className="inline-flex items-center px-2 rounded-md bg-[#00c0ee] text-white text-[11px] font-extrabold leading-none">
      Payme
    </span>
  );
}

export function CardBrandsRow({ size = 24, className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <VisaIcon size={size} />
      <MastercardIcon size={size} />
      <UzcardIcon size={size} />
      <HumoIcon size={size} />
    </div>
  );
}

export const PAYMENT_ICON_MAP = {
  card: BankCardIcon,
  cash: CashIcon,
  click: ClickIcon,
  payme: PaymeIcon,
  visa: VisaIcon,
  mastercard: MastercardIcon,
  uzcard: UzcardIcon,
  humo: HumoIcon,
};
