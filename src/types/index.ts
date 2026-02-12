import type { Todo } from "../services/graphql/generated/graphql";

export type { Todo, TodoStatus } from "../services/graphql/generated/graphql";
export type TodoListProps = {
  todos: Todo[];
  onToggleDone: (id: string) => void;
};

export type TodoInputProps = {
  onAdd: (text: string) => void;
};
