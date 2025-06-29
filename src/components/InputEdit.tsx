"use client";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

interface InputEditProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputEdit({
  value,
  onChange,
  className,
  ...props
}: React.ComponentProps<"input"> & InputEditProps) {
  return (
    <label className="group">
      <p className={cn("w-full group-focus-within:hidden", className)}>
        {value}
      </p>
      <Input
        isBorder
        className="w-full absolute -z-10 opacity-0 group-focus-within:static group-focus-within:opacity-100"
        placeholder="输入标题"
        type="text"
        value={value}
        onChange={onChange}
        onBlur={props?.onBlur}
      />
    </label>
  );
}
