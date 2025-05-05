"use client";

import { Plus, Circle, ArrowUp, Calendar } from "react-feather";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DatePicker } from "../ui/datePicker";
import LabelIcon from "../LabelIcon";

interface ListLayoutFooterProps {
  handleAdd: ({
    name,
    endDate,
  }: {
    name: string;
    endDate: Date | undefined;
  }) => void;
}

export default function ListLayoutFooter({ handleAdd }: ListLayoutFooterProps) {
  const [name, setName] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>();

  const add = () => {
    handleAdd({ name, endDate });
    setName("");
    setEndDate(undefined);
  };

  return (
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
            onClick={name ? add : undefined}
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
  );
}
