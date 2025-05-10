"use client";

import { useEffect, useState } from "react";

import { List, Todo, Todos } from "@/app/global.types";
import Collapse from "@/components/Collapse";
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

type NewList = List & {
  todos: Todos;
};

export default function ListPage() {
  const [lists, setLists] = useState<NewList[]>();

  useEffect(() => {
    const fetchData = async () => {
      const db = await dbPromise();
      const tx = db.transaction(["lists", "todos"], "readonly");
      const listsMap = new Map();
      const todos: Todos = await tx
        .objectStore("todos")
        .index("isCompleted")
        .getAll(IDBKeyRange.only(1));
      todos.forEach((t) => {
        if (listsMap.has(t.listId)) {
          listsMap.set(t.listId, [...listsMap.get(t.listId), t]);
        } else {
          listsMap.set(t.listId, [t]);
        }
      });
      const lists = await Promise.all(
        listsMap.keys().map((id: number) => tx.objectStore("lists").get(id))
      );
      const newLists = lists
        .map((list) => {
          const todos = listsMap.get(list.id);
          return { ...list, count: todos.length, todos };
        })
        .sort((a, b) => a.id - b.id);
      setLists(newLists);
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
      isCollected: 0,
      isCompleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = await set("todos", 0, newTodo);
    newTodo["id"] = id as number;
    setLists((lists) => {
      return lists?.map((list) => {
        if (list.id === 5) {
          return { ...list, todos: [...list.todos, newTodo] };
        }
        return list;
      });
    });
  };

  const handleComplete = (todo: Todo) => {
    const { id, ...data } = todo;
    const completeTime = data.isCompleted ? undefined : new Date();
    set("todos", id, {
      ...data,
      isCompleted: data.isCompleted ? 0 : 1,
      completeTime,
    });
    setLists((lists) => {
      return lists?.map((list) => {
        if (list.id === todo.listId) {
          return {
            ...list,
            todos: list.todos.filter((todo) => todo.id !== id),
          };
        }
        return list;
      });
    });
  };

  const handleCollect = (todo: Todo) => {
    const { id, ...data } = todo;
    set("todos", id, { ...data, isCollected: data.isCollected ? 0 : 1 });
    setLists((lists) => {
      return lists?.map((list) => {
        if (list.id === todo.listId) {
          return {
            ...list,
            todos: list.todos.map((todo) => {
              if (id === todo.id) {
                return { ...todo, isCollected: data.isCollected ? 0 : 1 };
              }
              return todo;
            }),
          };
        }
        return list;
      });
    });
  };

  const NewListItem = ({ todo }: { todo: Todo }) => {
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
      <ListLayoutHeader title="已完成" items={items} />
      <div className="flex-1 px-2">
        {lists?.map((list) => {
          return (
            <Collapse title={list.name} key={list.id}>
              <>
                {list.todos.map((todo) => {
                  return <NewListItem todo={todo} key={todo.id} />;
                })}
              </>
            </Collapse>
          );
        })}
      </div>
      {/* <ListLayoutFooter handleAdd={handleAdd} /> */}
    </div>
  );
}
