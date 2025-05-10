export interface List {
  id: number;
  name: string;
  isSystem: boolean;
  count?: number;
}

export type Lists = List[];

export interface fileType {
  id?: number;
  name: string;
  size: number;
}

export interface Todo {
  id?: number;
  listId: number;
  name: string;
  dueDate?: Date;
  endDate?: Date;
  remindTime?: Date;
  completeTime?: Date;
  files?: fileType[];
  remark?: string;
  isCollected: 1 | 0;
  isCompleted: 1 | 0;
  createdAt: Date;
  updatedAt: Date;
}

export type Todos = Todo[];
