import { cn } from "@/lib/utils";
import { format, isThisYear } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useMemo } from "react";
import { XCircle } from "react-feather";

interface LabelIconType {
  label: string;
  icon: React.ReactElement;
  date?: Date;
  className?: string;
  onClear?: () => void;
}

export default function LabelIcon({
  label,
  icon,
  date,
  onClear,
  className,
}: LabelIconType) {
  const formatDate = useMemo(() => {
    if (!date) return "";
    if (isThisYear(date))
      return format(date, "M月d日 E 到期", { locale: zhCN });
    return format(date, "yyyy年M月d日 E 到期", { locale: zhCN });
  }, [date]);

  const handleClear = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    onClear?.();
  };

  const SelectDate = () => {
    return (
      <div className={cn("flex flex-row items-center px-2 py-1", className)}>
        <div>{icon}</div>
        <div className="ml-2 text-xs">{label}</div>
      </div>
    );
  };

  const SelectedDate = () => {
    return (
      <div
        className={cn(
          "flex flex-row items-center text-white bg-blue-400 px-2 py-1 rounded-full",
          className
        )}
      >
        <div className="text-white">{icon}</div>
        <div className="ml-2 text-xs text-white mr-1">{formatDate}</div>
        <XCircle
          size={18}
          color="white"
          fill="white"
          stroke="#51a2ff"
          onClick={handleClear}
        />
      </div>
    );
  };

  return !date ? <SelectDate /> : <SelectedDate />;
}
