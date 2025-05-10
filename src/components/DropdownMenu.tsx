import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { itemType } from "./components";

interface DropdownMenuComponentProps {
  children: React.ReactElement;
  items?: itemType[];
  onSelect?: (type: string) => void;
}

export default function DropdownMenuComponent({
  children,
  items,
  onSelect,
}: DropdownMenuComponentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {items &&
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
