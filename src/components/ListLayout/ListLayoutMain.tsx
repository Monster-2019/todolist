"use client";

import { useState } from "react";
import { ChevronDown } from "react-feather";

import ListItem from "@/components/ListItem";
import { cn } from "@/lib/utils";
import { Todo } from "@/app/global.types";

interface ListLayoutMainProps {
  pendingTasks: Todo[];
  finishedTasks: Todo[];
  finishedTasksLength: number;
  handleComplete: (task: Todo) => void;
  handleCollect: (task: Todo) => void;
}

export default function ListLayoutMain({
  pendingTasks,
  finishedTasks,
  finishedTasksLength,
  handleComplete,
  handleCollect,
}: ListLayoutMainProps) {
  const [hideFinishList, setHideFinishList] = useState<boolean>(false);

  const toggleShowFinish = () => {
    setHideFinishList((value) => !value);
  };

  return (
    <div className="flex-1 px-2">
      {pendingTasks.map((todo, i) => {
        return (
          <ListItem
            href={`/todo/${todo.id!}`}
            todo={todo}
            key={todo.id}
            onComplete={handleComplete}
            onCollect={handleCollect}
          />
        );
      })}
      {finishedTasksLength > 0 && (
        <div
          className="flex flex-row text-white my-2"
          onClick={toggleShowFinish}
        >
          <ChevronDown
            className={cn("transition-all duration-300 ease-in-out", {
              "-rotate-90": hideFinishList,
            })}
          />
          <span className="mx-2">已完成</span>
          <span>{finishedTasksLength}</span>
        </div>
      )}
      <div
        className={cn(
          "h-auto transition-all ease-in-out duration-300 opacity-100",
          {
            "h-0 opacity-0 hidden": hideFinishList,
          }
        )}
      >
        {finishedTasks.map((todo, i) => {
          return (
            <ListItem
              href={`/todo/${todo.id!}`}
              todo={todo}
              key={todo.id}
              onComplete={handleComplete}
              onCollect={handleCollect}
            />
          );
        })}
      </div>
    </div>
  );
}
