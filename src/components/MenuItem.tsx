import { ReactElement } from "react";
import Link from "next/link";

interface propsType {
  icon: ReactElement;
  title: string;
  href: string;
  count?: number;
}

export default function MenuItem({ icon, title, count, href }: propsType) {
  return (
    <Link href={href}>
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row items-center">
          <div className="icon mr-4">{icon}</div>
          <div className="title">{title}</div>
        </div>
        <div className="count">{count}</div>
      </div>
    </Link>
  );
}
