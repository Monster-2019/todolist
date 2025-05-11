"use client";

import { fileType, Todo } from "@/app/global.types";
import AlertDialog from "@/components/AlertDialog";
import DetailItem from "@/components/DetailItem";
import ListLayoutHeader from "@/components/ListLayout/ListLayoutHeader";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAlertDialog from "@/hooks/useAlertDialog";
import { del, get, set } from "@/lib/idb";
import { cn, debounce, formatDate, formatFileSize } from "@/lib/utils";
import { isBefore, isToday as isTodayDate, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Circle,
  File,
  Star,
  Sun,
  Trash,
  X,
} from "react-feather";
import { toast } from "sonner";

const FILE_MAX_SIZE = 1024 * 1024 * 20;

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

  const { showAlertDialog, AlertDialog: FunctionAlertDialog } =
    useAlertDialog();

  const totalFilesSize = useMemo(() => {
    return todo?.files?.reduce((t, file) => t + file.size, 0) ?? 0;
  }, [todo?.files]);

  const isExpired = useMemo(() => {
    return todo?.endDate
      ? isBefore(todo?.endDate, startOfDay(new Date()))
      : false;
  }, [todo?.endDate]);

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

  const handleComplete = async () => {
    const { id, ...data } = todo!;
    const completeTime = data.isCompleted ? undefined : new Date();
    set("todos", id, {
      isCompleted: data.isCompleted ? 0 : 1,
      completeTime,
    });
    setTodo((todo) => ({
      ...todo!,
      isCompleted: todo?.isCompleted ? 0 : 1,
      completeTime,
    }));
  };

  const handleCollect = async () => {
    const { id, ...data } = todo!;
    set("todos", id, { isCollected: data.isCollected ? 0 : 1 });
    setTodo((todo) => ({ ...todo!, isCollected: todo?.isCollected ? 0 : 1 }));
  };

  const handleToday = async () => {
    const { id, dueDate } = todo!;
    const date = dueDate ? undefined : new Date();
    set("todos", id, { dueDate: date });
    setTodo((todo) => ({ ...todo!, dueDate: date }));
  };

  const handleSelectEndDate = async (date: Date | undefined) => {
    const { id } = todo!;
    const dueDate = date && isTodayDate(date) ? new Date() : todo?.dueDate;
    set("todos", id, { endDate: date, dueDate });
    setTodo((todo) => ({ ...todo!, endDate: date, dueDate }));
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 0) return;
    const file = e.target.files![0];
    const { name, size } = file;
    if (totalFilesSize + size > FILE_MAX_SIZE) {
      e.target.value = "";
      toast(`附件所有文件的总大小不能超过 ${FILE_MAX_SIZE / 1024 / 1024} MB`);
      return;
    }
    const { id, files = [] } = todo!;
    const fileId = await set("files", 0, { file });
    const fileData: fileType = { name, id: fileId as number, size };
    set("todos", id, { files: [...files, fileData] });
    setTodo((todo) => ({ ...todo!, files: [...files, fileData] }));
    e.target.value = "";
  };

  const handleDeleteFile = async (id: number) => {
    const isAction = await showAlertDialog({
      description: "你确定要删除这个文件吗？",
      actionText: "删除",
    });
    if (isAction) {
      del("files", id);
      set("todos", todo?.id, {
        files: todo?.files?.filter((file) => file.id !== id),
      });
      setTodo((todo) => ({
        ...todo!,
        files: todo?.files?.filter((file) => file.id !== id),
      }));
    }
  };

  const debounceChangeRemark = useCallback(
    debounce(async (value: string) => {
      const { id } = todo!;
      set("todos", id, { remark: value });
    }, 500),
    [todo?.id]
  );

  const changeRemark = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTodo((todo) => ({
      ...todo!,
      remark: value,
    }));
    debounceChangeRemark(value);
  };

  return (
    <div className="bg-gray-100 h-screen">
      <ListLayoutHeader title={listName} theme="white" />
      <div className="flex flex-row justify-between items-center p-4 bg-white rounded-md mb-0.5 shadow-md rounded-none">
        <div className="flex flex-row items-center">
          <div className="leading mr-2" onClick={handleComplete}>
            {!todo?.isCompleted ? (
              <Circle size={20} />
            ) : (
              <Check size={20} stroke="#51a2ff" />
            )}
          </div>
          <div className="leading">
            <p className={cn("title", { "line-through": todo?.isCompleted })}>
              {todo?.name}
            </p>
          </div>
        </div>
        <div className="leading" onClick={handleCollect}>
          {!todo?.isCollected ? (
            <Star size={20} />
          ) : (
            <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
          )}
        </div>
      </div>
      {/* 今天 */}
      <DetailItem
        icon={<Sun size={20} color={isToday ? "#51a2ff" : "black"} />}
        hasDate={!!isToday}
        onClear={() => handleToday()}
      >
        <div
          className={cn("text-gray-400 text-sm", {
            "text-blue-400": isToday,
          })}
          onClick={handleToday}
        >
          {isToday ? `已添加到"我的一天"` : `添加到"我的一天"`}
        </div>
      </DetailItem>
      {/* 截止时间 */}
      <DetailItem
        icon={
          <Calendar
            size={20}
            color={!todo?.endDate ? "#000" : isExpired ? "#ff6467" : "#51a2ff"}
          />
        }
        hasDate={!!todo?.endDate}
        onClear={() => handleSelectEndDate(undefined)}
      >
        <DatePicker selected={todo?.endDate} onSelect={handleSelectEndDate}>
          <div
            className={cn("text-gray-400 text-sm", {
              "text-blue-400": todo?.endDate,
              "text-red-400": isExpired,
            })}
          >
            {todo?.endDate
              ? formatDate(todo?.endDate, `date 到期`)
              : "添加截止时间"}
          </div>
        </DatePicker>
      </DetailItem>
      {/* 添加文件 */}
      <DetailItem className="overflow-hidden py-0">
        <div className="flex flex-col w-full overflow-hidden">
          {todo?.files?.map((file) => {
            return (
              <div
                className="flex flex-row items-center box-border overflow-hidden"
                key={file.id}
              >
                <div className="size-9 flex justify-center items-center bg-blue-400 rounded-sm text-white text-xs">
                  {file.name.split(".").pop()?.toUpperCase()}
                </div>
                <div className="flex flex-1 flex-col h-full justify-between text-sm overflow-hidden ml-4 py-4 pr-4 border-b-[1px]">
                  <p className="leading-none overflow-hidden whitespace-nowrap">
                    {file.name}
                  </p>
                  <p className="leading-none text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <X
                  color="gray"
                  size={18}
                  onClick={() => handleDeleteFile(file.id!)}
                />
              </div>
            );
          })}
          <div className="flex flex-row gap-5 w-full relative py-4">
            <File size={20} />
            <div className="text-gray-400 text-sm">
              <p>添加文件</p>
              <Input
                type="file"
                className="absolute top-0 left-0 right-0 bottom-0 opacity-0"
                onChange={(e) => {
                  handleUpload(e);
                }}
              />
              {/* <Input type="file" /> */}
            </div>
          </div>
        </div>
      </DetailItem>
      {/* 添加备注 */}
      <DetailItem>
        <Textarea
          rows={5}
          className="border-0 shadow-none focus-visible:ring-0"
          placeholder="添加备注"
          value={todo?.remark}
          onChange={changeRemark}
        />
      </DetailItem>

      {/* 删除 */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-row justify-between items-center p-4 bg-white">
        <span className="text-sm text-gray-400">
          {todo?.isCompleted
            ? formatDate(todo?.completeTime, "完成时间：date")
            : formatDate(todo?.createdAt, "创建于 date")}
        </span>
        <AlertDialog
          title="删除提醒"
          description={`你将永久删除 ${todo?.name}`}
          onAction={handleDelete}
        >
          <Trash size={20} color="#99a1af" />
        </AlertDialog>
      </div>
      <FunctionAlertDialog />
    </div>
  );
}
