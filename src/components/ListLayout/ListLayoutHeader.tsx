import { cn } from "@/lib/utils";
import Link from "next/link";
import { MoreVertical, ArrowLeft } from "react-feather";

interface ListLayoutHeaderProps {
  title: String;
  isMore?: boolean;
  theme?: "white" | "blue";
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
  isMore,
  theme = "blue",
}: ListLayoutHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-row justify-between p-4 box-border h-14",
        colorTheme[theme]["header"]
      )}
    >
      <div className="flex flex-row items-center">
        <Link href="/">
          <ArrowLeft color={colorTheme[theme]["icon"]} />
        </Link>
        <div className="ml-4">{title}</div>
      </div>
      {isMore && <MoreVertical color={colorTheme[theme]["icon"]} />}
    </header>
  );
}
