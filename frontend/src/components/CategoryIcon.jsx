import {
  Smartphone, Laptop, Refrigerator, Utensils, Monitor, Shirt,
  Sparkles, Home as HomeIcon, Dumbbell, Car, Baby, BookOpen, Package,
} from "lucide-react";

const ICON_MAP = {
  smartphone: Smartphone,
  telefon: Smartphone,
  laptop: Laptop,
  elektronika: Laptop,
  refrigerator: Refrigerator,
  texnika: Refrigerator,
  utensils: Utensils,
  "oziq-ovqat": Utensils,
  monitor: Monitor,
  kompyuter: Monitor,
  shirt: Shirt,
  kiyim: Shirt,
  sparkles: Sparkles,
  gozallik: Sparkles,
  home: HomeIcon,
  uy: HomeIcon,
  dumbbell: Dumbbell,
  sport: Dumbbell,
  car: Car,
  avto: Car,
  baby: Baby,
  bolalar: Baby,
  book: BookOpen,
  kitob: BookOpen,
};

export default function CategoryIcon({ slug, icon, size = 18, className = "" }) {
  const key = (icon || slug || "").toLowerCase();
  const match = Object.keys(ICON_MAP).find((k) => key.includes(k));
  const Icon = ICON_MAP[match] || Package;
  return <Icon size={size} className={className} />;
}
