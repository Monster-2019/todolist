"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface ListItemProps {
  children: React.ReactElement;
  leading?: React.ReactElement;
  action?: React.ReactElement;
  onLeading?: (e: MouseEvent<HTMLDivElement>) => void;
  onAction?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function ListItem({
  children,
  leading,
  action,
  onLeading,
  onAction,
}: ListItemProps) {
  const router = useRouter();

  return (
    <div className="flex flex-row justify-between items-center h-16 px-4 bg-white rounded-md mb-0.5">
      <div className="flex flex-row items-center">
        {leading && (
          <div className="leading mr-2" onClick={onLeading}>
            {leading}
          </div>
        )}
        {children}
      </div>
      {action && (
        <div className="action" onClick={onAction}>
          {action}
        </div>
      )}
    </div>
  );
}
