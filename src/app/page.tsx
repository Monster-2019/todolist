"use client";

import {
  Search,
  Sun,
  Star,
  Grid,
  CheckCircle,
  Clipboard,
  List,
  Plus,
} from "react-feather";
import MenuItem from "@/components/MenuItem";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dbPromise from "@/lib/idb";
import { Lists } from "./global.types";

const ICONS: { [key: number]: React.ReactElement } = {
  1: <Sun size={20} color="orange" />,
  2: <Star size={20} color="purple" />,
  3: <Grid size={20} color="black" />,
  4: <CheckCircle size={20} color="green" />,
  5: <Clipboard size={20} color="blue" />,
};

export default function Home() {
  const [lists, setlists] = useState<Lists>([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = await dbPromise();
      const tx = db.transaction(["lists", "todos"], "readonly");
      const lists: Lists = await tx.objectStore("lists").getAll();

      const todoStore = tx.objectStore("todos");
      const counts = await Promise.all(
        lists.map((list) =>
          todoStore.index("listId").count(IDBKeyRange.only(list.id))
        )
      );

      const newLists: Lists = lists.map((list, i) => ({
        ...list,
        count: counts[i],
      }));
      // console.log(newLists);
      setlists(newLists);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="flex flex-row justify-between p-4 box-border h-14">
        <div>Logo</div>
        <div>
          <Search className="text-blue-400" />
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div>
          {lists
            .filter((list) => list.isSystem)
            .map((list) => {
              return (
                <MenuItem
                  key={list.id}
                  icon={ICONS[list.id]}
                  title={list.name}
                  count={list.count}
                  href={"/list/" + list.id}
                />
              );
            })}
        </div>
        <div className="w-[92%] mx-[4%] h-0.5 bg-gray-100 my-2"></div>
        <div>
          {lists
            .filter((list) => !list.isSystem)
            .map((list) => {
              return (
                <MenuItem
                  key={list.id}
                  icon={<List size={20} color="blue" />}
                  title={list.name}
                  count={list.count}
                  href={"/list/" + list.id}
                />
              );
            })}
        </div>
      </main>
      <Link href="/list/0">
        <div className="p-4 flex flex-row items-center text-blue-400">
          <Plus className="mr-4" />
          新建列表
        </div>
      </Link>
    </div>
  );
}
