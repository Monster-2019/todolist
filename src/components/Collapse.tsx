"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface CollapseProps {
  children: React.ReactElement;
  total?: number;
  title: string;
}

export default function Collapse({ children, total, title }: CollapseProps) {
  const [isHide, setIsHide] = useState<boolean>(true);

  return (
    !!total && (
      <Collapsible className="flow-root">
        <CollapsibleTrigger asChild>
          <div
            className="flex flex-row items-center text-white my-2"
            onClick={() => setIsHide(!isHide)}
          >
            <ChevronDown
              className={cn("transition-all duration-300 ease-in-out", {
                "-rotate-90": isHide,
              })}
            />
            <span className="mx-2">{title}</span>
            <span>{total}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <div>{children}</div>
        </CollapsibleContent>
      </Collapsible>
    )
  );
}
