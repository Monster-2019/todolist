export interface List {
  id: number;
  name: string;
  isSystem: boolean;
  count?: number;
}

export type Lists = List[];

export interface Todo {
  id?: number;
  listId: number;
  name: string;
  dueDate?: Date;
  endDate?: Date;
  remindTime?: Date;
  files?: File[];
  remark?: string;
  isCollected: boolean;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Todos = Todo[];
