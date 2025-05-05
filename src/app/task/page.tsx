"use client";

import ListLayout from "@/components/ListLayout/ListLayout";
import useTaskStore, { Task } from "@/stores/taskStore";
import { useMemo } from "react";

export default function Create() {
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

  const handleAdd = ({
    name,
    endDate,
  }: {
    name: string;
    endDate: Date | undefined;
  }) => {
    add({ name: name!, endDate });
  };

  const handleFinish = (task: Task) => {
    update({ ...task, isFinish: !task.isFinish });
  };

  const handleCollect = (task: Task) => {
    update({ ...task, isCollected: !task.isCollected });
  };

  return (
    <ListLayout
      title="任务"
      pendingTasks={pendingTasks}
      finishedTasks={finishedTasks}
      finishedTasksLength={finishedTasksLength}
      handleAdd={handleAdd}
      handleFinish={handleFinish}
      handleCollect={handleCollect}
    />
  );
}
