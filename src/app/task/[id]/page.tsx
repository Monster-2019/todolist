"use client";

import ListLayoutHeader from "@/components/ListLayout/ListLayoutHeader";
import { Circle, Star, Check } from "react-feather";
import dbPromise from "@/lib/idb";
import { cn } from "@/lib/utils";
import { Task } from "@/stores/taskStore";
import { useEffect, useState } from "react";

interface TaskDetailParams {
  id: string;
}

export default function Edit({
  params,
}: {
  params: Promise<TaskDetailParams>;
}) {
  const [task, setTask] = useState<Task>();
  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      console.log(id);
      const db = await dbPromise("todo-task");
      const result = await db.get("todo-task", id);
      console.log(result);
      setTask(result);
    };
    fetchData();
  }, [params]);

  return (
    <div>
      <ListLayoutHeader title="任务" isMore={false} theme="white" />
      <div className="flex flex-row justify-between items-center p-4 bg-white rounded-md mb-0.5 shadow-md rounded-none">
        <div className="flex flex-row items-center">
          <div className="leading mr-2" onClick={() => {}}>
            {!task?.isFinish ? (
              <Circle size={20} />
            ) : (
              <Check size={20} stroke="#51a2ff" />
            )}
          </div>
          <div className="leading">
            <p className={cn("title", { "line-through": task?.isFinish })}>
              {task?.name}
            </p>
          </div>
        </div>
        <div className="leading" onClick={() => {}}>
          {!task?.isCollected ? (
            <Star size={20} />
          ) : (
            <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
          )}
        </div>
      </div>
    </div>
  );
}
