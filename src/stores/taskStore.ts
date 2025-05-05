import { create } from "zustand";
import { persist, PersistStorage, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import dbPromise from "@/lib/idb";

const idbStorage = {
  getItem: async (name: string) => {
    const db = await dbPromise(name);
    const store: Task[] = await db.getAll(name);

    return JSON.stringify({ state: { tasks: store } });
  },
  setItem: async (name: string, value: any) => {
    const data = JSON.parse(value);
    const tasks = data.state.tasks;
    if (tasks.length === 0) return;
    const db = await dbPromise(name);
    const tx = db.transaction(name, "readwrite");
    const store = tx.objectStore(name);
    const ids = await store.getAllKeys();
    await Promise.all(
      tasks.map((task: Task) =>
        ids.includes(task.id!) ? store.put(task) : store.add(task)
      )
    );
    await tx.done;
  },
  removeItem: async (name: string) => {
    const db = await dbPromise(name);
    await db.clear(name);
  },
};

export interface Task {
  id?: string;
  name: string;
  isCollected?: boolean;
  isToday?: boolean;
  endDate?: Date;
  remindTime?: Date;
  files?: File[];
  remark?: string;
  isFinish?: boolean;
  createTime?: Date;
}

interface TodoStore {
  tasks: Task[];
  add: (task: Task) => void;
  update: (task: Task) => void;
}

const useTaskStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      add: (task: Task) => {
        const id = uuidv4();

        const newTask = {
          id,
          name: task.name,
          isCollected: false,
          isToday: false,
          endDate: task.endDate,
          remindTime: task.remindTime,
          files: [],
          remark: task.remark,
          isFinish: false,
          createTime: new Date(),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      update: (task: Task) => {
        console.log(123);
        const newTasks = get().tasks.map((t) => {
          return t.id === task.id ? { ...t, ...task } : t;
        });
        console.log(newTasks);
        set(() => ({
          tasks: newTasks,
        }));
      },
    }),
    {
      name: "todo-task",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["add", "finishTasks"].includes(key)
          )
        ),
    }
  )
);

export default useTaskStore;
