import { openDB } from "idb";

const dbPromise = (objectStore: string, version: number = 1) => {
  return openDB("todolist", version, {
    upgrade(db) {
      console.log(objectStore);
      if (!db.objectStoreNames.contains(objectStore)) {
        db.createObjectStore(objectStore, {
          keyPath: "id", // 主键
        });
        // 创建索引（提升查询效率）
        // store.createIndex("idIndex", "id", { unique: true });
      }
    },
  });
};

export default dbPromise;
