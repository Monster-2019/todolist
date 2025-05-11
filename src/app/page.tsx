"use client";

import {
  Search,
  Sun,
  Star,
  Grid,
  CheckCircle,
  Clipboard,
  List as ListIcon,
  Plus,
} from "react-feather";
import MenuItem from "@/components/MenuItem";
import Link from "next/link";
import { useEffect, useState } from "react";
import dbPromise from "@/lib/idb";
import { Lists } from "./global.types";
import { addDays, startOfDay } from "date-fns";

const ICONS: { [key: number]: React.ReactElement } = {
  1: <Sun size={20} color="orange" />,
  2: <Star size={20} color="purple" />,
  3: <Grid size={20} color="black" />,
  4: <CheckCircle size={20} color="green" />,
  5: <Clipboard size={20} color="blue" />,
};

interface List {
  name: string;
  id: number;
  count: number;
  isSystem: boolean;
}

export default function Home() {
  const [lists, setlists] = useState<List[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = await dbPromise();
      const tx = db.transaction(["lists", "todos"], "readonly");
      const lists: Lists = await tx.objectStore("lists").getAll();

      const todoStore = tx.objectStore("todos");

      const counts = await Promise.all(
        lists.map((list) => {
          switch (list.id) {
            case 1:
              let startToday = startOfDay(new Date());
              return todoStore
                .index("dueDate")
                .count(
                  IDBKeyRange.bound(
                    startToday,
                    addDays(startToday, 1),
                    false,
                    true
                  )
                );
            case 2:
              return todoStore
                .index("isCompleted_isCollected")
                .count(IDBKeyRange.only([0, 1]));
            case 3:
              return todoStore.index("isCompleted").count(IDBKeyRange.only(0));
            case 4:
              return;
            default:
              return todoStore
                .index("isCompleted_list")
                .count(IDBKeyRange.only([0, list.id]));
          }
        })
      );

      const newLists: List[] = lists.map((list, i) => ({
        ...list,
        count: counts[i] as number,
      }));

      setlists(newLists);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="flex flex-row justify-between p-4 box-border h-14">
        <div>Logo</div>
        <div>
          <Link href="/todo/search">
            <Search className="text-blue-400" />
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div>
          {lists
            .filter((list) => list.isSystem)
            .map((list) => (
              <MenuItem
                key={list.id}
                icon={ICONS[list.id]}
                title={list.name}
                count={list.count}
                href={"/list/" + list.id}
              />
            ))}
        </div>
        <div className="w-[92%] mx-[4%] h-0.5 bg-gray-100 my-2"></div>
        <div>
          {lists
            .filter((list) => !list.isSystem)
            .map((list) => {
              return (
                <MenuItem
                  key={list.id}
                  icon={<ListIcon size={20} color="blue" />}
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
