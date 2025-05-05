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
import useTaskStore from "@/stores/taskStore";
import { useMemo } from "react";

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks);
  const tasksTotal = useMemo(() => tasks.length, [tasks]);

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
          <MenuItem
            icon={<Sun size={20} color="orange" />}
            title="我的一天"
            count={0}
            href="/"
          />
          <MenuItem
            icon={<Star size={20} color="purple" />}
            title="重要"
            count={0}
            href="/"
          />
          <MenuItem
            icon={<Grid size={20} color="black" />}
            title="全部"
            count={0}
            href="/"
          />
          <MenuItem
            icon={<CheckCircle size={20} color="green" />}
            title="已完成"
            count={0}
            href="/"
          />
          <MenuItem
            icon={<Clipboard size={20} color="blue" />}
            title="任务"
            count={tasksTotal}
            href="/task"
          />
        </div>
        <div className="w-[92%] mx-[4%] h-0.5 bg-gray-100 my-2"></div>
        <div>
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
          <MenuItem
            icon={<List size={20} color="blue" />}
            title="重庆"
            href="/task"
          />
        </div>
      </main>
      <Link href="/list">
        <div className="p-4 flex flex-row items-center text-blue-400">
          <Plus className="mr-4" />
          新建列表
        </div>
      </Link>
    </div>
  );
}
