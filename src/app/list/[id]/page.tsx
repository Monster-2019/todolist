"use client";

import ListLayout from "@/components/ListLayout/ListLayout";
import { useEffect, useMemo, useState } from "react";
import dbPromise from "@/lib/idb";
import { List, Todo, Todos } from "@/app/global.types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useListNamesStore from "@/stores/listNameStore";
import { generateUniqueName } from "@/lib/utils";
import { set } from "@/lib/idb";
import { useRouter } from "next/navigation";

export default function ListPage({ params }: { params: { id: number } }) {
  const [list, setList] = useState<List>();
  const [todos, setTodos] = useState<Todos>();
  const [listName, setListName] = useState<string>("");

  const listNames = useListNamesStore((state) => state.listNames);
  const add = useListNamesStore((state) => state.add);
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
    () => todos?.filter((todo) => !todo.isComplete) ?? [],
    [todos]
  );

  const finishedTodos = useMemo(
    () => todos?.filter((todo) => todo.isComplete) ?? [],
    [todos]
  );

  const handleAdd = async ({
    name,
    endDate,
  }: {
    name: string;
    endDate: Date | undefined;
  }) => {
    // add({ name: name!, endDate });
    // listId: number;
    // name: string;
    // dueDate: Date;
    // endDate: Date;
    // remindTime: Date;
    // files: File[];
    // remark: string;
    // isCollected: boolean;
    // isComplete: boolean;
    // createdAt: Date;
    // updatedAt: Date;
    const newTodo: Todo = {
      name,
      endDate,
      listId: list!.id,
      isCollected: false,
      isComplete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = await set("todos", 0, newTodo);
    newTodo["id"] = id as number;
    setTodos((todos) => [...todos!, newTodo]);
  };

  const handleFinish = (task: Todo) => {
    update({ ...task, isFinish: !task.isComplete });
  };

  const handleCollect = (task: Todo) => {
    update({ ...task, isCollected: !task.isCollected });
  };

  const handleCreate = async () => {
    const newName = generateUniqueName(listName, listNames);
    const newList = {
      name: newName,
      isSystem: false,
    };
    add(newName);
    const id = await set("lists", 0, newList);
    router.push(`/list/${id}`);
  };

  return (
    <>
      <ListLayout
        title={list?.name ?? ""}
        pendingTasks={pendingTodos}
        finishedTasks={finishedTodos}
        finishedTasksLength={finishedTodos.length}
        handleAdd={handleAdd}
        handleFinish={handleFinish}
        handleCollect={handleCollect}
      />
      <Dialog open={list !== undefined && !list?.id}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
          hideClose
        >
          <DialogHeader>
            <DialogTitle>新建列表</DialogTitle>
          </DialogHeader>
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
          <DialogFooter className="justify-end flex flex-row">
            <Link href="/">
              <Button type="submit" variant="secondary">
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={!listName} onClick={handleCreate}>
              创建列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
