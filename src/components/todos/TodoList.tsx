import type { TodoListProps } from "../../types/index.ts";

function TodoList({ todos, onToggleDone }: TodoListProps) {
  // Split todos into sections so we can render separate lists.
  const pendingTodos = todos.filter((todo) => todo.status !== "DONE");
  const doneTodos = todos.filter((todo) => todo.status === "DONE");

  return (
    <div className="todo-sections">
      {/* Pending Todos Section */}
      <div className="todo-section">
        <h3 className="section-title">Tasks</h3>
        <ul className="todo-list">
          {pendingTodos.length === 0 ? (
            <li className="todo-empty">No pending tasks!</li>
          ) : (
            pendingTodos.map((todo) => (
              <li
                key={todo.id}
                className="todo-item"
                // Make the whole list item act like a button.
                onClick={() => onToggleDone(todo.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // Support keyboard toggling for accessibility.
                  if (e.key === "Enter" || e.key === " ") {
                    onToggleDone(todo.id);
                  }
                }}
              >
                {todo.name}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Done Todos Section */}
      {doneTodos.length > 0 && (
        <div className="todo-section">
          <h3 className="section-title">Done</h3>
          <ul className="todo-list done-list">
            {doneTodos.map((todo) => (
              <li
                key={todo.id}
                className="todo-item todo-done"
                // Same toggle behavior for completed items.
                onClick={() => onToggleDone(todo.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // Keep keyboard interaction consistent across lists.
                  if (e.key === "Enter" || e.key === " ") {
                    onToggleDone(todo.id);
                  }
                }}
              >
                {todo.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TodoList;
