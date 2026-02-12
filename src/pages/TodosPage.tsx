import TodoInput from "../components/todos/TodoInput.tsx";
import TodoList from "../components/todos/TodoList.tsx";
import type { Todo } from "../types/index.ts";

type TodosPageProps = {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggleDone: (id: string) => void;
};

function TodosPage({ todos, onAdd, onToggleDone }: TodosPageProps) {
  return (
    <div className="todos-content">
      <h2>Your Todos</h2>
      <TodoInput onAdd={onAdd} />
      <TodoList todos={todos} onToggleDone={onToggleDone} />
    </div>
  );
}

export default TodosPage;
