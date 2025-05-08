"use client";

import ListLayoutHeader from "@/components/ListLayout/ListLayoutHeader";
import { Circle, Star, Check, Sun, Calendar, File, Trash } from "react-feather";
import { del, get } from "@/lib/idb";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import DetailItem from "@/components/DetailItem";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Todo } from "@/app/global.types";
import { isToday as isTodayDate } from "date-fns";
import AlertDialog from "@/components/AlertDialog";
import { useRouter } from "next/navigation";

interface TaskDetailParams {
  id: string;
}

export default function Edit({
  params,
}: {
  params: Promise<TaskDetailParams>;
}) {
  const [todo, setTodo] = useState<Todo>();
  const [listName, setListName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      const todo = await get("todos", Number(id));
      const list = await get("lists", Number(todo.listId));
      setTodo(todo);
      setListName(list.name);
    };
    fetchData();
  }, [params]);

  const isToday = useMemo(() => {
    return todo?.dueDate ? isTodayDate(todo?.dueDate) : false;
  }, [todo]);

  const handleDelete = async () => {
    await del("todos", todo?.id!);
    router.back();
  };

  return (
    <div className="bg-gray-100 h-screen">
      <ListLayoutHeader title={listName} isMore={false} theme="white" />
      <div className="flex flex-row justify-between items-center p-4 bg-white rounded-md mb-0.5 shadow-md rounded-none">
        <div className="flex flex-row items-center">
          <div className="leading mr-2" onClick={() => {}}>
            {!todo?.isComplete ? (
              <Circle size={20} />
            ) : (
              <Check size={20} stroke="#51a2ff" />
            )}
          </div>
          <div className="leading">
            <p className={cn("title", { "line-through": todo?.isComplete })}>
              {todo?.name}
            </p>
          </div>
        </div>
        <div className="leading" onClick={() => {}}>
          {!todo?.isCollected ? (
            <Star size={20} />
          ) : (
            <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
          )}
        </div>
      </div>
      {/* 今天 */}
      <DetailItem
        icon={<Sun size={20} color={isToday ? "#99a1af" : "black"} />}
      >
        <div
          className={cn("text-gray-400 text-sm", {
            "text-blue-400": isToday,
          })}
        >
          {isToday ? `已添加到"我的一天"` : `添加到"我的一天"`}
        </div>
      </DetailItem>
      {/* 截止时间 */}
      <DetailItem icon={<Calendar size={20} />}>
        <div className="text-gray-400 text-sm">添加截止时间</div>
      </DetailItem>
      {/* 添加文件 */}
      <DetailItem icon={<File size={20} />}>
        <div className="text-gray-400 text-sm relative">
          <p>添加文件</p>
          {/* <Input type="file" /> */}
        </div>
      </DetailItem>
      {/* 添加备注 */}
      <DetailItem>
        <Textarea
          rows={5}
          className="border-0 shadow-none focus-visible:ring-0"
          placeholder="添加备注"
        />
      </DetailItem>

      {/* 删除 */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-row justify-between items-center p-4 bg-white">
        <span className="text-sm text-gray-400">
          创建于
          {todo?.createdAt
            ? format(todo.createdAt, "yyyy年M月d日E", { locale: zhCN })
            : ""}
        </span>
        <AlertDialog
          title="删除提醒"
          description={`你将永久删除 ${todo?.name}`}
          onAction={handleDelete}
        >
          <Trash size={20} color="#99a1af" />
        </AlertDialog>
      </div>
    </div>
  );
}
