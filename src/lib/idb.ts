import { openDB } from "idb";

const dbPromise = (version: number = 3) => {
  return openDB("todolist", version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion < 1) {
        const listsStore = db.createObjectStore("lists", {
          keyPath: "id",
          autoIncrement: true,
        });

        listsStore.createIndex("name", "name", { unique: true });
        listsStore.createIndex("isSystem", "isSystem");

        const systemLists = [
          { name: "我的一天", isSystem: true },
          { name: "重要", isSystem: true },
          { name: "全部", isSystem: true },
          { name: "已完成", isSystem: true },
          { name: "任务", isSystem: true },
        ];

        systemLists.forEach((list) => listsStore.add(list));

        const todosStore = db.createObjectStore("todos", {
          keyPath: "id",
          autoIncrement: true,
        });

        todosStore.createIndex("listId", "listId"); // 列表ID索引
        todosStore.createIndex("dueDate", "dueDate"); // 截止日期索引
        todosStore.createIndex("isCollected", "isCollected"); // 重要标记索引
        todosStore.createIndex("isCompleted", "isCompleted"); // 完成状态索引
        todosStore.createIndex("dueDate_list", ["dueDate", "listId"]); // 今天+所属列表
        todosStore.createIndex("isCollected_list", ["isCollected", "listId"]); // 重要+所属列表
        todosStore.createIndex("isCompleted_list", ["isCompleted", "listId"]); // 注意字段名一致性

        db.createObjectStore("files", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (oldVersion < 2) {
        const todosStore = transaction.objectStore("todos");
        todosStore.createIndex("isCompleted_isCollected", [
          "isCompleted",
          "isCollected",
        ]);
      }
      if (oldVersion < 3) {
        const todosStore = transaction.objectStore("todos");
        todosStore.createIndex("name", "name", { multiEntry: true });
      }
    },
  });
};

export const set = async (
  objectStore: string,
  id: number | string | undefined,
  val: any
): Promise<number> => {
  const db = await dbPromise();
  const tx = db.transaction(objectStore, "readwrite");
  const store = tx.objectStore(objectStore);
  const data = id && (await store.get(id));
  if (data) {
    return (await store.put({ ...data, ...val })) as number;
  } else {
    return (await store.add(val)) as number;
  }
};

export const get = async (objectStore: string, id: string | number) => {
  const db = await dbPromise();
  return await db.get(objectStore, id);
};

export const del = async (objectStore: string, id: string | number) => {
  const db = await dbPromise();
  return db.delete(objectStore, id);
};

export default dbPromise;
