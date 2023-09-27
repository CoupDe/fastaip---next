import { CommonPriceVisr, RowData } from "@/const/interfaces";

// Проверка является ли первый символ числом
export function isNumber(val: string) {
  if (typeof val != "string") return true;
  return isNaN(+val);
}
// Возврат строки с первой заглавной буквой
export function capitalize(val: string): string {
  const result = val[0].toUpperCase() + val.slice(1, val.length);
  return result;
}
// Конвертация типов для создания строки таблицы
export function convertToDataRow(data: RowData): RowData {
  return {
    id: data.id,
    parentId: data.parentId,
    pos: data.pos,
    numberData:data.numberData || '',
    code: data.code || "",
    name: data.name?.trim() || "",
    unit: data.unit || "",
    quantity: data.quantity,
    unit_cost: data.unit_cost,
    total_cost: data.total_cost,
    type_work: data.type_work?.trim(),
  };
}

export function checkNumberofPercent(percent: string): number | null {
  let value = percent.replace(",", "."); // заменяем запятую на точку
  const numberValue = parseFloat(value);

  if (numberValue === 0) return null;
  if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 100) {
    return numberValue;
  } else {
    return null;
  }
}
