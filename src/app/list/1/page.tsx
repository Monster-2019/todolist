"use client";

import { useEffect, useMemo, useState } from "react";

import { Lists, Todo } from "@/app/global.types";
import Collapse from "@/components/Collapse";
import { itemType } from "@/components/components";
import ListItem from "@/components/ListItem";
import { ListLayoutFooter, ListLayoutHeader } from "@/components/ListLayout";
import dbPromise, { set } from "@/lib/idb";
import { cn, formatDate } from "@/lib/utils";
import { addDays, isBefore, startOfDay } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Check, Circle, Edit2, File, Star } from "react-feather";

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
  const [todos, setTodos] = useState<Todos>();

  const router = useRouter();

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
      const todayStart = startOfDay(new Date());
      const endStart = addDays(todayStart, 1);
      const todos: Todos = await tx
        .objectStore("todos")
        .index("dueDate")
        .getAll(IDBKeyRange.bound(todayStart, endStart, false, true));
      const newTodos = todos.map((todo) => {
        return { ...todo, listName: listsMap.get(todo.listId) };
      });
      setTodos(newTodos);
    };
    fetchData();
  }, []);

  const pendingTodos = useMemo(
    () => todos?.filter((todo) => !todo.isCompleted) ?? [],
    [todos]
  );

  const finishedTodos = useMemo(
    () => todos?.filter((todo) => todo.isCompleted) ?? [],
    [todos]
  );

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
      isCollected: 0,
      isCompleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(),
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
    setTodos((todos) =>
      todos?.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            isCompleted: t.isCompleted ? 0 : 1,
            completeTime,
          };
        }
        return t;
      })
    );
  };

  const handleCollect = (todo: Todo) => {
    const { id, ...data } = todo;
    set("todos", id, { ...data, isCollected: data.isCollected ? 0 : 1 });
    setTodos((todos) =>
      todos?.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            isCollected: t.isCollected ? 0 : 1,
          };
        }
        return t;
      })
    );
  };

  const NewListItem = ({ todo }: { todo: NewTodo }) => {
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
      <ListLayoutHeader title="我的一天" items={items} />
      <div className="flex-1 px-2">
        {pendingTodos.map((todo) => {
          return <NewListItem todo={todo} key={todo.id} />;
        })}
        <Collapse total={finishedTodos.length} title="已完成">
          <>
            {finishedTodos.map((todo) => {
              return <NewListItem todo={todo} key={todo.id} />;
            })}
          </>
        </Collapse>
      </div>
      <ListLayoutFooter handleAdd={handleAdd} />
    </div>
  );
}
