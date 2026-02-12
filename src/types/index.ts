export type TodoStatus = "UNDONE" | "INPROGRESS" | "DONE";

export type Todo = {
  id: string;
  name: string;
  status: TodoStatus;
  createdAt?: string;
  updatedAt?: string;
};
export type TodoListProps = {
  todos: Todo[];
  onToggleDone: (id: string) => void;
};

export type TodoInputProps = {
  onAdd: (text: string) => void;
};
