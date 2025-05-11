import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { itemType } from "./components";

interface DropdownMenuComponentProps {
  trigger: React.ReactElement;
  children?: React.ReactElement;
  items?: itemType[];
  onSelect?: (type: string) => void;
}

export default function DropdownMenuComponent({
  trigger,
  children,
  items,
  onSelect,
}: DropdownMenuComponentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {children
          ? children
          : items &&
            items.map((item) => {
              return (
                <DropdownMenuItem
                  onClick={() => onSelect?.(item.type)}
                  key={item.type}
                >
                  {item.icon}
                  {item.children}
                </DropdownMenuItem>
              );
            })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
