import { openDB } from "idb";

const dbPromise = (version: number = 1) => {
  return openDB("todolist", version, {
    upgrade(db, oldVersion) {
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
        todosStore.createIndex("isImportant", "isImportant"); // 重要标记索引
        todosStore.createIndex("isCompleted", "isCompleted"); // 完成状态索引
        todosStore.createIndex("today_list", ["dueDate", "listId"]); // 今天+所属列表
        todosStore.createIndex("important_list", ["isImportant", "listId"]); // 重要+所属列表
      }
    },
  });
};

export const set = async (
  objectStore: string,
  id: number | string | undefined,
  val: any
) => {
  const db = await dbPromise();
  const tx = db.transaction(objectStore, "readwrite");
  const store = tx.objectStore(objectStore);
  const data = id && (await store.get(id));
  if (data) {
    return await store.put({ ...data, ...val });
  } else {
    return await store.add(val);
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
