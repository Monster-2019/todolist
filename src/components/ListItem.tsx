"use client";

import { Circle, Star, Check } from "react-feather";
import { Task } from "@/stores/taskStore";
import { cn } from "@/lib/utils";
import RouterLink from "next/link";

interface ListItemProps {
  task: Task;
  href: string;
  onComplete: (task: Task) => void;
  onCollect: (task: Task) => void;
}

export default function ListItem({
  task,
  onComplete,
  onCollect,
  href,
}: ListItemProps) {
  return (
    <RouterLink href={href}>
      <div className="flex flex-row justify-between items-center p-4 bg-white rounded-md mb-0.5">
        <div className="flex flex-row items-center">
          <div className="leading mr-2" onClick={() => onComplete(task)}>
            {!task.isFinish ? (
              <Circle size={20} />
            ) : (
              <Check size={20} stroke="#51a2ff" />
            )}
          </div>
          <div className="leading">
            <p className={cn("title", { "line-through": task.isFinish })}>
              {task.name}
            </p>
          </div>
        </div>
        <div className="leading" onClick={() => onCollect(task)}>
          {!task.isCollected ? (
            <Star size={20} />
          ) : (
            <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
          )}
        </div>
      </div>
    </RouterLink>
  );
}
