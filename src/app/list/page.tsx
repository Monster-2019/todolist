"use client";

import {
  MoreVertical,
  ArrowLeft,
  ChevronDown,
  Plus,
  Circle,
  ArrowUp,
  Calendar,
  Bell,
} from "react-feather";
import ListItem from "@/components/ListItem";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LabelIcon from "@/components/LabelIcon";
import { DatePicker } from "@/components/ui/datePicker";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/stores/taskStore";

export default function List() {
  const [endDate, setEndDate] = useState<Date>();
  const [name, setName] = useState<string>("");
  const [hideFinishList, setHideFinishList] = useState<boolean>(false);

  const tasks = useTaskStore((state) => state.tasks);
  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.isFinish),
    [tasks]
  );
  const finishedTasks = useMemo(
    () => tasks.filter((task) => task.isFinish),
    [tasks]
  );
  const finishedTasksLength = useMemo(
    () => finishedTasks.length,
    [finishedTasks]
  );

  const add = useTaskStore((state) => state.add);
  const update = useTaskStore((state) => state.update);

  // const finishTaskTotal = useMemo(() => finishTasks.length, [finishTasks]);

  const handleAdd = () => {
    add({ name: name!, endDate });
    setEndDate(undefined);
    setName("");
  };

  const handleFinish = (task: Task) => {
    update({ ...task, isFinish: !task.isFinish });
  };

  const handleCollect = (task: Task) => {
    update({ ...task, isCollected: !task.isCollected });
  };

  const toggleShowFinish = () => {
    setHideFinishList((value) => !value);
  };

  return (
    <div className="flex flex-col overflow-hidden bg-blue-400 h-screen w-screen">
      <header className="flex flex-row justify-between p-4 box-border h-14">
        <div className="flex flex-row items-center">
          <Link href="/">
            <ArrowLeft color="white" />
          </Link>
          <div className="text-white ml-2">重庆</div>
        </div>
        <div>
          <MoreVertical color="white" />
        </div>
      </header>
      <div className="flex-1 px-2">
        {pendingTasks.map((task, i) => {
          return (
            <ListItem
              task={task}
              key={task.id}
              onComplete={handleFinish}
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
          {finishedTasks.map((task, i) => {
            return (
              <ListItem
                task={task}
                key={task.id}
                onComplete={handleFinish}
                onCollect={handleCollect}
              />
            );
          })}
        </div>
      </div>

      <Dialog>
        <DialogTrigger>
          <div className="fixed bottom-4 right-4 rounded-full p-4 bg-blue-200">
            <Plus color="#155dfc" />
          </div>
        </DialogTrigger>
        <DialogContent
          hideClose
          className="fixed transfrom-none max-w-full bottom-0 top-auto translate-none left-0 rounded-none p-4 gap-0"
        >
          <DialogTitle></DialogTitle>
          <div className="flex flex-row items-center mb-1">
            <Circle size={20} />
            <Input
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-0 focus:border-0 shadow-none"
              placeholder="添加任务"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              autoFocus
            />
            <div
              className={cn("bg-gray-300 rounded-sm p-1", {
                "bg-blue-400": name,
              })}
              onClick={name ? handleAdd : undefined}
            >
              <ArrowUp size={20} color="white" />
            </div>
          </div>
          <div className="flex flex-row">
            <DatePicker selected={endDate} onSelect={setEndDate}>
              <LabelIcon
                className="mr-4 text-gray-500"
                label="设置截止时间"
                icon={<Calendar size={20} />}
                date={endDate}
                onClear={() => setEndDate(undefined)}
              />
            </DatePicker>
            {/* <LabelIcon
              className="text-gray-500"
              label="提醒我"
              icon={<Bell size={20} />}
            /> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
