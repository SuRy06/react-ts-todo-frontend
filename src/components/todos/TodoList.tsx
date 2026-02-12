import type { TodoListProps } from "../../types/index.ts";

function TodoList({ todos, onToggleDone }: TodoListProps) {
  // Reusable component: displays whatever todos array is passed in
  // The parent component (TodosPage) handles filtering by tab
  return (
    <div className="todo-list-container">
      {/* Show empty state if no todos provided */}
      {todos.length === 0 ? (
        <div className="todo-empty">No tasks to display!</div>
      ) : (
        <ul className="todo-list">
          {/* Render each todo as a clickable list item */}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item${todo.status === "DONE" ? " todo-done" : ""}`}
              // Make the whole list item clickable to toggle status
              onClick={() => onToggleDone(todo.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                // Support keyboard toggling for accessibility
                if (e.key === "Enter" || e.key === " ") {
                  onToggleDone(todo.id);
                }
              }}
            >
              {/* Display todo name */}
              <span>{todo.name}</span>
              {/* Show status badge */}
              <span className="todo-status">{todo.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
