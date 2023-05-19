// Проверка является ли первый символ числом
export function isNumber(val: string) {
  if (typeof val != "string") return true;
  return isNaN(+val);
}
// Воврат строки с первой заглавной буквой
export function capitalize(val: string): string {
  const result = val[0].toUpperCase() + val.slice(1, val.length);
  return result;
}
