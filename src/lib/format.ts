// Formatação de datas e números
export function formatYear(year: number): string {
  if (year === undefined || year === null) return "—";
  // Anos negativos representam antes de Cristo.
  if (year < 0) return `${Math.abs(year)} a.C.`;
  return String(year);
}

export function formatNumber(num: number): string {
  return num.toLocaleString("pt-BR");
}
