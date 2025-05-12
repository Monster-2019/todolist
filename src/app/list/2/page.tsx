"use client";

import { useEffect, useState } from "react";

import { Lists, Todo } from "@/app/global.types";
import { itemType } from "@/components/components";
import ListItem from "@/components/ListItem";
import { ListLayoutFooter, ListLayoutHeader } from "@/components/ListLayout";
import dbPromise, { set } from "@/lib/idb";
import { cn, formatDate } from "@/lib/utils";
import { isBefore, isToday, startOfDay } from "date-fns";
import Link from "next/link";
import { Calendar, Check, Circle, Edit2, File, Star, Sun } from "react-feather";

const items: itemType[] = [
  // {
  //   icon: <Trash size={20} color="#99a1af" />,
  //   children: <p>删除列表</p>,
  //   type: "delete",
  // },
];

type NewTodo = Todo & {
  listName: string;
};

type Todos = NewTodo[];

export default function ListPage() {
  const [todos, setTodos] = useState<Todos>([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = await dbPromise();
      const tx = db.transaction(["lists", "todos"], "readonly");
      const lists: Lists = await tx
        .objectStore("lists")
        .getAll(IDBKeyRange.lowerBound(5));
      const listsMap = new Map();
      lists.forEach((list) => {
        listsMap.set(list.id, list.name);
      });
      const todos: Todos = await tx
        .objectStore("todos")
        .index("isCompleted_isCollected")
        .getAll(IDBKeyRange.only([0, 1]));
      const newTodos = todos.map((todo) => {
        return { ...todo, listName: listsMap.get(todo.listId) };
      });
      setTodos(newTodos);
    };
    fetchData();
  }, []);

  const handleAdd = async ({
    name,
    endDate,
  }: {
    name: string;
    endDate: Date | undefined;
  }) => {
    const newTodo: Todo = {
      name,
      endDate,
      listId: 5,
      isCollected: 1,
      isCompleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = await set("todos", 0, newTodo);
    newTodo["id"] = id as number;
    setTodos((todos) => [...todos!, { ...newTodo, listName: "任务" }]);
  };

  const handleComplete = (todo: Todo) => {
    const { id, ...data } = todo;
    const completeTime = data.isCompleted ? undefined : new Date();
    set("todos", id, {
      ...data,
      isCompleted: data.isCompleted ? 0 : 1,
      completeTime,
    });
    const newTodos = todos.filter((t) => t.id !== id);
    setTodos(newTodos);
  };

  const handleCollect = (todo: Todo) => {
    const { id, ...data } = todo;
    set("todos", id, { ...data, isCollected: data.isCollected ? 0 : 1 });
    const newTodos = todos.filter((t) => t.id !== id);
    setTodos(newTodos);
  };

  const NewListItem = ({ todo }: { todo: NewTodo }) => {
    const isCurToday = todo?.dueDate ? isToday(todo?.dueDate) : false;

    const isExpired = todo?.endDate
      ? isBefore(todo?.endDate, startOfDay(new Date()))
      : false;

    return (
      <Link href={`/todo/${todo.id}`}>
        <ListItem
          key={todo.id}
          leading={
            !todo?.isCompleted ? (
              <Circle size={20} />
            ) : (
              <Check size={20} stroke="#51a2ff" />
            )
          }
          onLeading={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleComplete(todo);
          }}
          action={
            !todo.isCollected ? (
              <Star size={20} />
            ) : (
              <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
            )
          }
          onAction={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCollect(todo);
          }}
        >
          <div className="flex flex-col gap-1">
            <p
              className={cn("title text-sm", {
                "line-through": todo?.isCompleted,
              })}
            >
              {todo?.name}
            </p>
            <div className="flex flex-row items-center gap-1 text-sm">
              {isCurToday && (
                <>
                  <Sun size={14} />
                  <span>我的一天</span>
                </>
              )}
              <span>{todo.listName}</span>
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
          </div>
        </ListItem>
      </Link>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden bg-blue-400 h-screen w-screen">
      <ListLayoutHeader title="重要" items={items} />
      <div className="flex-1 px-2 overflow-y-auto pb-18">
        {todos.map((todo) => {
          return <NewListItem todo={todo} key={todo.id} />;
        })}
      </div>
      <ListLayoutFooter handleAdd={handleAdd} />
    </div>
  );
}
