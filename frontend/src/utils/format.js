export function formatPrice(value) {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("uz-UZ").format(Math.round(Number(value)));
}

export function formatSom(value) {
  return `${formatPrice(value)} so'm`;
}

export const CATEGORY_ICON_FALLBACK = "Package";
