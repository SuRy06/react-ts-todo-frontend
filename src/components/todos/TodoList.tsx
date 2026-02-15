import type { TodoListProps } from "../../types/index.ts";

function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
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
              className={`todo-item${todo.status === "DONE" ? " todo-done" : ""}${
                todo.status === "INPROGRESS" ? " todo-inprogress" : ""
              }`}
              // Make the whole list item clickable to toggle status
              onClick={() => onToggle(todo.id, todo.status)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                // Support keyboard toggling for accessibility
                if (e.key === "Enter" || e.key === " ") {
                  onToggle(todo.id, todo.status);
                }
              }}
            >
              {/* Display todo name */}
              <span className="todo-text">{todo.name}</span>
              {/* Delete icon block (logic to be wired later) */}
              <button
                type="button"
                className="todo-delete"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(todo.id);
                }}
                aria-label={`Delete ${todo.name}`}
              >
                <span className="todo-delete-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M6 6l1 14h10l1-14" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
