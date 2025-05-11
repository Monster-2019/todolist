"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { List, Todo, Todos } from "@/app/global.types";
import Collapse from "@/components/Collapse";
import { itemType } from "@/components/components";
import Dialog from "@/components/Dialog";
import ListItem from "@/components/ListItem";
import { ListLayoutFooter, ListLayoutHeader } from "@/components/ListLayout";
import { Input } from "@/components/ui/input";
import useAlertDialog from "@/hooks/useAlertDialog";
import dbPromise, { del, set } from "@/lib/idb";
import { cn, formatDate, generateUniqueName } from "@/lib/utils";
import useListNamesStore from "@/stores/listNameStore";
import { isBefore, isToday, startOfDay } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  Circle,
  Edit2,
  File,
  Star,
  Sun,
  Trash,
} from "react-feather";

const items: itemType[] = [
  {
    icon: <Trash size={20} color="#99a1af" />,
    children: <p>删除列表</p>,
    type: "delete",
  },
];

export default function ListPage({ params }: { params: { id: number } }) {
  const [list, setList] = useState<List>();
  const [todos, setTodos] = useState<Todos>();
  const [listName, setListName] = useState<string>("");

  const { showAlertDialog, AlertDialog } = useAlertDialog();

  const lists = useListNamesStore((state) => state.lists);
  const add = useListNamesStore((state) => state.add);
  const delStore = useListNamesStore((state) => state.del);

  const listNames = useMemo(() => lists.map((list) => list.name), [lists]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      if (!id) return;
      const db = await dbPromise();
      const listResult = (await db.get("lists", Number(id))) || {
        name: "无标题列表",
      };
      const listsresult: Todos = await db.getAllFromIndex(
        "todos",
        "listId",
        IDBKeyRange.only(Number(id))
      );
      setList(listResult);
      setTodos(listsresult);
    };
    fetchData();
  }, [params]);

  const pendingTodos = useMemo(
    () => todos?.filter((todo) => !todo.isCompleted) ?? [],
    [todos]
  );

  const finishedTodos = useMemo(
    () => todos?.filter((todo) => todo.isCompleted) ?? [],
    [todos]
  );

  const handleAddList = async () => {
    const newName = generateUniqueName(listName, listNames);
    const newList = {
      name: newName,
      isSystem: false,
    };
    const id: number = await set("lists", 0, newList);
    add({ ...newList, id });
    router.replace(`/list/${id}`);
  };

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
      listId: list!.id,
      isCollected: 0,
      isCompleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = await set("todos", 0, newTodo);
    newTodo["id"] = id as number;
    setTodos((todos) => [...todos!, newTodo]);
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

  const deleteAction = async () => {
    const promiseList = todos?.map((todo) => del("todos", todo.id!)) || [];
    await Promise.all([del("lists", list?.id!), ...promiseList]);
    delStore(list?.id!);
    router.back();
  };

  const handleSelect = async (type: string) => {
    switch (type) {
      case "delete":
        const isAction = await showAlertDialog({
          title: "你确定吗？",
          description: `将永久删除"${list?.name}"`,
          actionText: "确定删除",
        });
        if (isAction) deleteAction();
        break;
      default:
        break;
    }
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
    <>
      <div className="flex flex-col overflow-hidden bg-blue-400 h-screen w-screen">
        <ListLayoutHeader
          title={list?.name!}
          items={items}
          onSelect={handleSelect}
        />
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
      <Dialog
        open={list !== undefined && !list?.id}
        actionDisabled={!listName}
        title="新建列表"
        onAction={handleAddList}
        onCancel={() => router.back()}
      >
        <div className="grid gap-4 py-4">
          <div>
            <Input
              id="name"
              placeholder="输入列表标题"
              autoComplete="off"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
      <AlertDialog />
    </>
  );
}
