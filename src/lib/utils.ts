import useListNamesStore from "@/stores/listNameStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
