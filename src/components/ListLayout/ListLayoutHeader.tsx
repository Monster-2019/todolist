import { cn } from "@/lib/utils";
import { MoreVertical, ArrowLeft } from "react-feather";
import DropdownMenu from "../DropdownMenu";
import { itemType } from "../components";
import { useRouter } from "next/navigation";

interface ListLayoutHeaderProps {
  title: String;
  theme?: "white" | "blue";
  items?: itemType[];
  onSelect?: (type: string) => void;
}

const colorTheme = {
  white: {
    header: "bg-white text-black",
    icon: "black",
  },
  blue: {
    header: "bg-blue-400, text-white",
    icon: "white",
  },
};

export default function ListLayoutHeader({
  title,
  items,
  theme = "blue",
  onSelect,
}: ListLayoutHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex flex-row justify-between p-4 box-border h-14",
        colorTheme[theme]["header"]
      )}
    >
      <div className="flex flex-row items-center">
        <ArrowLeft
          color={colorTheme[theme]["icon"]}
          onClick={() => router.back()}
        />
        <div className="ml-4">{title}</div>
      </div>
      {items && items.length > 0 && (
        <DropdownMenu
          items={items}
          onSelect={onSelect}
          trigger={<MoreVertical color={colorTheme[theme]["icon"]} />}
        ></DropdownMenu>
      )}
    </header>
  );
}
