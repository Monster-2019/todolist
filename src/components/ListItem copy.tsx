"use client";

import { Circle, Star, Check, Sun, Calendar, File, Edit2 } from "react-feather";
import { cn, formatDate } from "@/lib/utils";
import { Todo } from "@/app/global.types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { isBefore, isToday as isTodayDate, startOfDay } from "date-fns";

interface ListItemProps {
  children: React.ReactElement;
  leading?: React.ReactElement;
  action?: React.ReactElement;
  onLeading?: () => {};
  onAction?: () => {};
}

export default function ListItem({
  todo,
  onComplete,
  onCollect,
  href,
}: ListItemProps) {
  const router = useRouter();

  const isToday = useMemo(() => {
    return todo?.dueDate ? isTodayDate(todo?.dueDate) : false;
  }, [todo]);

  const isExpend = useMemo(() => {
    return isToday || todo.endDate || todo.files?.length;
  }, [todo]);

  const isExpired = useMemo(() => {
    return todo?.endDate
      ? isBefore(todo?.endDate, startOfDay(new Date()))
      : false;
  }, [todo]);

  return (
    <div
      className="flex flex-row justify-between items-center h-16 px-4 bg-white rounded-md mb-0.5"
      onClick={() => router.push(href)}
    >
      <div className="flex flex-row items-center">
        <div
          className="leading mr-2"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(todo);
          }}
        >
          {!todo?.isCompleted ? (
            <Circle size={20} />
          ) : (
            <Check size={20} stroke="#51a2ff" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p
            className={cn("title", {
              "line-through": todo?.isCompleted,
              "text-sm": isExpend,
            })}
          >
            {todo?.name}
          </p>
          {isExpend && (
            <div className="flex flex-row items-center gap-1 text-sm">
              {isToday && (
                <>
                  <Sun size={14} />
                  <span>我的一天</span>
                </>
              )}
              {todo.endDate && (
                <>
                  <Calendar
                    size={14}
                    color={isExpired ? "#ff6467" : "#51a2ff"}
                  />
                  <span
                    className={cn("text-blue-400", {
                      "text-red-400": isExpired,
                    })}
                  >
                    {formatDate(todo.endDate)}
                  </span>
                </>
              )}
              {todo.files?.length && <File size={14} />}
              {todo.remark && <Edit2 size={14} />}
            </div>
          )}
        </div>
      </div>
      <div
        className="leading"
        onClick={(e) => {
          e.stopPropagation();
          onCollect(todo);
        }}
      >
        {!todo.isCollected ? (
          <Star size={20} />
        ) : (
          <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
        )}
      </div>
    </div>
  );
}
