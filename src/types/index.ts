import type { Todo, TodoStatus } from "../services/graphql/generated/graphql";

export type { Todo, TodoStatus } from "../services/graphql/generated/graphql";
export type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string, status: TodoStatus) => void;
  onDelete: (id: string) => void;
};

export type TodoInputProps = {
  onAdd: (text: string) => void;
};
