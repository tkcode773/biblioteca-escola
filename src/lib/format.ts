// Formatação de datas e números
export function formatYear(year: number): string {
  return year?.toString() ?? "—";
}

export function formatNumber(num: number): string {
  return num.toLocaleString("pt-BR");
}
