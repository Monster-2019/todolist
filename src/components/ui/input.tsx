import * as React from "react";

import { cn } from "@/lib/utils";
import { X } from "react-feather";

function Input({
  className,
  type,
  isBorder,
  clearable,
  value,
  onChange,
  ...props
}: React.ComponentProps<"input"> & {
  isBorder?: boolean;
  clearable?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
          { "pr-5": clearable },
          className
        )}
        onChange={onChange}
        ref={inputRef}
        value={value}
        {...props}
      />
      {clearable && value && (
        <X
          className="absolute right-0 top-1/2 -translate-y-1/2"
          size={20}
          onClick={() => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value"
            )?.set;

            nativeInputValueSetter?.call(inputRef.current, "");

            const event = new Event("input", { bubbles: true });
            inputRef.current!.dispatchEvent(event);
          }}
        />
      )}
    </div>
  );
}

export { Input };
