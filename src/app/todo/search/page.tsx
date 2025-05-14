"use client";

import { Todo, Todos } from "@/app/global.types";
import DropdownMenu from "@/components/DropdownMenu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import dbPromise, { set } from "@/lib/idb";
import { cn, debounce } from "@/lib/utils";
import useListNamesStore from "@/stores/listNameStore";
import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, Check, Circle, MoreVertical, Star } from "react-feather";

interface itemType {
  text: React.ReactElement;
  toggleText: React.ReactElement;
  type: string;
  isSelected: boolean;
}

const ITEMS: itemType[] = [
  {
    text: <p>隐藏已完成项目</p>,
    toggleText: <p>显示已完成项目</p>,
    type: "hidden",
    isSelected: false,
  },
];

let data: Todos = [];

const fuseOptions = {
  keys: ["name"],
  threshold: 0,
};

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<Todos>([]);
  const [isHideCompleted, setIsHideCompleted] = useState<boolean>(false);
  const [isSearch, setisSearch] = useState<boolean>(false);

  const lists = useListNamesStore((store) => store.lists);

  useEffect(() => {
    const fetchDate = async () => {
      const db = await dbPromise();
      const result: Todos = await db
        .transaction("todos")
        .objectStore("todos")
        .getAll();
      data = result;

      if (q) {
        setQuery(q);
        handleSearch(q);
      }
    };
    fetchDate();
  }, []);

  const resultFilter: Todos = useMemo(() => {
    return result.filter((list: Todo) =>
      isHideCompleted ? !list.isCompleted : list
    );
  }, [result, isHideCompleted]);

  const listsMap = useMemo(() => {
    return lists.reduce((t, c) => {
      t.set(c.id, c.name);
      return t;
    }, new Map());
  }, [lists]);

  useEffect(() => {
    listsMapRef.current = listsMap;
  }, [listsMap]);

  const listsMapRef = useRef(listsMap);

  const onSelect = (type: string) => {
    switch (type) {
      case "hidden":
        setIsHideCompleted(!isHideCompleted);
        break;
      default:
        break;
    }
  };

  var handleSearch = async (value: string) => {
    const fuse = new Fuse(data, fuseOptions);
    setisSearch(true);
    const result: Todos = fuse.search(value).map((item) => {
      return {
        ...item.item,
        listName: listsMapRef.current.get(item.item.listId),
      };
    });
    setResult(result);
    setisSearch(false);
  };

  const debounceChangeRemark = useCallback(
    debounce(async (value: string) => {
      handleSearch(value);
    }, 500),
    []
  );

  const replaceState = (value: string) => {
    const { origin, pathname } = window.location;
    const search = value ? `?q=${value}` : "";
    history.replaceState(null, "", origin + pathname + search);
  };

  const changeQuery = (value: string) => {
    replaceState(value);
    if (!value) {
      setQuery(value);
      setResult([]);
      return;
    }
    setQuery(value);
    debounceChangeRemark(value);
  };

  const handleComplete = (todo: Todo) => {
    const { id, ...data } = todo;
    const completeTime = data.isCompleted ? undefined : new Date();
    set("todos", id, {
      ...data,
      isCompleted: data.isCompleted ? 0 : 1,
      completeTime,
    });
    setResult((todos) =>
      todos?.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            isCompleted: t.isCompleted ? 0 : 1,
            completeTime,
          };
        }
        return t;
      })
    );
  };

  const handleCollect = (todo: Todo) => {
    const { id, ...data } = todo;
    set("todos", id, { ...data, isCollected: data.isCollected ? 0 : 1 });
    setResult((todos) =>
      todos?.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            isCollected: t.isCollected ? 0 : 1,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <header
        className={cn(
          "flex flex-row justify-between p-4 box-border h-14 items-center gap-2 shadow relative"
        )}
      >
        <div className="flex flex-row items-center">
          <ArrowLeft color="black" onClick={() => router.back()} />
          {/* <div className="ml-4"></div> */}
        </div>
        <Input
          placeholder="搜索"
          autoComplete="off"
          isBorder={false}
          autoFocus
          clearable
          className="border-0 focus-visible:border-0 focus:border-0"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            changeQuery(e.target.value);
          }}
        />
        <DropdownMenu trigger={<MoreVertical color="black" />}>
          <>
            {ITEMS.map((item) => {
              return (
                <DropdownMenuItem
                  onClick={() => onSelect?.(item.type)}
                  key={item.type}
                >
                  {isHideCompleted ? item.toggleText : item.text}
                </DropdownMenuItem>
              );
            })}
          </>
        </DropdownMenu>
      </header>
      <div className="flex flex-1 overflow-hidden overflow-y-auto">
        {!query && !isSearch && (
          <div className="self-center mx-auto">搜索你想要的内容</div>
        )}

        {query && isSearch && (
          <div className="self-center mx-auto">搜索中···</div>
        )}

        {query && !isSearch && (
          <div className="w-full">
            {resultFilter.map((todo: Todo & { listName?: string }) => {
              return (
                <Link href={`/todo/${todo.id}`} key={todo.id}>
                  <div className="flex flex-row justify-between items-center h-16 px-4 bg-white mb-0.5 border-b-1 shadow-none rounded-none">
                    <div className="flex flex-row items-center">
                      <div
                        className="leading mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleComplete(todo);
                        }}
                      >
                        {!todo?.isCompleted ? (
                          <Circle size={20} />
                        ) : (
                          <Check size={20} stroke="#51a2ff" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p
                          className={cn("title text-sm", {
                            "line-through": todo?.isCompleted,
                          })}
                        >
                          {todo?.name}
                        </p>
                        <div className="flex flex-row items-center gap-1 text-sm">
                          {todo?.listName}
                        </div>
                      </div>
                    </div>
                    <div
                      className="action"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCollect(todo);
                      }}
                    >
                      {!todo.isCollected ? (
                        <Star size={20} />
                      ) : (
                        <Star size={20} fill="#51a2ff" stroke="#51a2ff" />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
