import ListLayoutHeader from "./ListLayoutHeader";
import ListLayoutMain from "./ListLayoutMain";
import ListLayoutFooter from "./ListLayoutFooter";
import { Todo } from "@/app/global.types";
import { itemType } from "../components";

interface ListLayoutProps {
  title: string;
  pendingTasks: Todo[];
  finishedTasks: Todo[];
  finishedTasksLength: number;
  items?: itemType[];
  handleComplete: (task: Todo) => void;
  handleCollect: (task: Todo) => void;
  onSelect?: (type: string) => void;
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
  onSelect,
  items,
  ...props
}: ListLayoutProps) {
  return (
    <div className="flex flex-col overflow-hidden bg-blue-400 h-screen w-screen">
      <ListLayoutHeader title={title} items={items} onSelect={onSelect} />
      <ListLayoutMain {...props} />
      <ListLayoutFooter handleAdd={handleAdd} />
    </div>
  );
}
