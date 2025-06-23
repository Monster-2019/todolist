import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isToday, isYesterday, isTomorrow, format, isThisYear } from "date-fns";
import { zhCN } from "date-fns/locale";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueName(name: string, listNames: string[]) {
  const listNamesObj = {} as Record<string, number>;
  listNames.forEach((key) => {
    listNamesObj[`${key}`] = 1;
  });

  if (!listNamesObj[name]) return name;

  // 生成递增名称并检查唯一性
  let counter = listNamesObj[name]++;
  let newName = `${name}(${counter})`;

  // 若新名称仍重复，继续递增（处理并发或重复调用）
  while (listNamesObj.hasOwnProperty(newName)) {
    counter = listNamesObj[name]++;
    newName = `${name}(${counter})`;
  }

  return newName;
}

export function formatDate(
  date: Date | undefined,
  formatString: string = "date"
) {
  if (!date) return "";
  let fDate = "";
  if (isToday(date)) fDate = `今天`;
  else if (isYesterday(date)) fDate = `昨天`;
  else if (isTomorrow(date)) fDate = `明天`;
  else if (isThisYear(date)) fDate = format(date, `M月d日 E`, { locale: zhCN });
  else fDate = format(date, `yyyy年M月d日 E`, { locale: zhCN });
  return formatString.replace("date", fDate);
}

export function formatFileSize(fileSize: number) {
  if (!fileSize) return "";
  if (fileSize < 1024) return `${fileSize} 字节`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  if (fileSize < 1024 * 1024 * 20)
    return `${(fileSize / 1024 / 1024).toFixed(1)} MB`;
}

export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  delay: number = 200
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: T) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function generatePeerId() {
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
  return nanoid();
}
