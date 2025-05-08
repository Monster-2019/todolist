import { create } from "zustand";
import { persist, PersistStorage, createJSONStorage } from "zustand/middleware";
import dbPromise from "@/lib/idb";
import { List } from "@/app/global.types";

interface listNamesState {
  listNames: string[];
  add: (name: string) => void;
  del: (name: string) => void;
}

const customStorage = {
  getItem: async (name: string) => {
    const db = await dbPromise();
    const lists: List[] = await db.getAll(name);
    console.log(
      lists.filter((list) => !list.isSystem).map((list) => list.name)
    );

    return JSON.stringify({
      state: {
        listNames: lists
          .filter((list) => !list.isSystem)
          .map((list) => list.name),
      },
    });
  },
  setItem: async (name: string, value: any) => {},
  removeItem: async (name: string) => {},
};

const useListNamesStore = create<listNamesState>()(
  persist(
    (set, get) => ({
      listNames: [],
      add: (name: string) =>
        set((state) => {
          return { listNames: [...state.listNames, name] };
        }),
      del: (name: string) =>
        set((state) => {
          return {
            listNames: state.listNames.filter((list) => list !== name),
          };
        }),
    }),
    { name: "lists", storage: createJSONStorage(() => customStorage) }
  )
);

export default useListNamesStore;
