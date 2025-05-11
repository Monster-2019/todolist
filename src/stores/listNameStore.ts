import { create } from "zustand";
import { persist, PersistStorage, createJSONStorage } from "zustand/middleware";
import dbPromise from "@/lib/idb";
import { List } from "@/app/global.types";

interface listNamesState {
  lists: List[];
  add: (list: List) => void;
  del: (id: number) => void;
}

const customStorage = {
  getItem: async (name: string) => {
    const db = await dbPromise();
    const lists: List[] = await db.getAll(name);

    return JSON.stringify({
      state: {
        lists: lists.filter((list) => list.id > 4),
      },
    });
  },
  setItem: async (name: string, value: any) => {},
  removeItem: async (name: string) => {},
};

const useListNamesStore = create<listNamesState>()(
  persist(
    (set, get) => ({
      lists: [],
      add: (list: List) =>
        set((state) => {
          return { lists: [...state.lists, list] };
        }),
      del: (id: number) =>
        set((state) => {
          return {
            lists: state.lists.filter((list) => list.id !== id),
          };
        }),
    }),
    { name: "lists", storage: createJSONStorage(() => customStorage) }
  )
);

export default useListNamesStore;
