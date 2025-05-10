import { cn } from "@/lib/utils";
import { X } from "react-feather";

interface DetailItemProps {
  children: React.ReactElement;
  icon?: React.ReactNode;
  hasDate?: boolean;
  onClear?: () => void;
  className?: string;
}

export default function DetailItem({
  children,
  icon,
  hasDate,
  className,
  onClear,
}: DetailItemProps) {
  return (
    <div
      className={cn(
        "mx-2 mt-2 bg-white p-4 flex flex-row justify-between items-center shadow-md",
        className
      )}
    >
      <div className="flex-1 flex flex-row gap-5 overflow-hidden">
        {icon}
        {children}
      </div>
      {hasDate && <X color="gray" size={18} onClick={onClear} />}
    </div>
  );
}
