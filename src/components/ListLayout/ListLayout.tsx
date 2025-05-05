import ListLayoutHeader from "./ListLayoutHeader";
import ListLayoutMain from "./ListLayoutMain";
import ListLayoutFooter from "./ListLayoutFooter";
import { Task } from "@/stores/taskStore";

interface ListLayoutProps {
  title: string;
  pendingTasks: Task[];
  finishedTasks: Task[];
  finishedTasksLength: number;
  handleFinish: (task: Task) => void;
  handleCollect: (task: Task) => void;
  handleAdd: ({
    name,
    endDate,
  }: {
    name: string;
    endDate: Date | undefined;
  }) => void;
}

export default function ListLayout({
  title,
  handleAdd,
  ...props
}: ListLayoutProps) {
  return (
    <div className="flex flex-col overflow-hidden bg-blue-400 h-screen w-screen">
      <ListLayoutHeader title={title} />
      <ListLayoutMain {...props} />
      <ListLayoutFooter handleAdd={handleAdd} />
    </div>
  );
}
