import { useState } from "react";
import TodoInput from "../components/todos/TodoInput.tsx";
import TodoList from "../components/todos/TodoList.tsx";
import type { Todo } from "../types/index.ts";

// Type definition for all props this component receives from the parent (App.tsx)
type TodosPageProps = {
  pendingTodos: Todo[]; // Array of incomplete todos (UNDONE, INPROGRESS)
  inProgressTodos: Todo[]; // Array of in-progress todos (INPROGRESS)
  doneTodos: Todo[]; // Array of completed todos (DONE)
  onAdd: (text: string) => void; // Callback to create a new todo
  onToggleDone: (id: string) => void; // Callback to change a todo's status
  pendingPage: number; // Current page number for pending todos
  inProgressPage: number; // Current page number for in-progress todos
  donePage: number; // Current page number for done todos
  pageSize: number; // Number of todos per page (e.g., 10)
  pendingTotalCount: number; // Total number of pending todos across all pages
  inProgressTotalCount: number; // Total number of inProgress todos across all pages
  doneTotalCount: number; // Total number of done todos across all pages
  onPendingPageChange: (page: number) => void; // Callback when pending tab page changes
  onInProgressPageChange: (page: number) => void; // Callback when inProgress tab page changes
  onDonePageChange: (page: number) => void; // Callback when done tab page changes
};

function TodosPage({
  pendingTodos,
  inProgressTodos,
  doneTodos,
  onAdd,
  onToggleDone,
  pendingPage,
  inProgressPage,
  donePage,
  pageSize,
  pendingTotalCount,
  inProgressTotalCount,
  doneTotalCount,
  onPendingPageChange,
  onInProgressPageChange,
  onDonePageChange,
}: TodosPageProps) {
  // Track which tab is currently active: "pending", "inProgress", or "done"
  const [activeTab, setActiveTab] = useState<"pending" | "inProgress" | "done">(
    "pending",
  );

  // Calculate the total number of pages for the currently active tab
  // Math.max(1, ...) ensures at least 1 page even if there are 0 todos
  const totalPages =
    activeTab === "pending"
      ? Math.max(1, Math.ceil(pendingTotalCount / pageSize)) // pendingTotalCount / pageSize = pages needed
      : activeTab === "inProgress"
        ? Math.max(1, Math.ceil(inProgressTotalCount / pageSize)) // inProgressTotalCount / pageSize = pages needed
        : Math.max(1, Math.ceil(doneTotalCount / pageSize)); // e.g.: 25 todos / 10 per page = 3 pages

  // Get the current page number for the active tab
  const currentPage =
    activeTab === "pending"
      ? pendingPage
      : activeTab === "inProgress"
        ? inProgressPage
        : donePage;

  // Determine if we can navigate to previous page (disabled if on page 1)
  const canGoBack = currentPage > 1;

  // Determine if we can navigate to next page (disabled if on last page)
  const canGoForward = currentPage < totalPages;

  // Get the todos array for the currently active tab to display
  const listTodos =
    activeTab === "pending"
      ? pendingTodos
      : activeTab === "inProgress"
        ? inProgressTodos
        : doneTodos;

  // Get the correct page change callback for the active tab
  const onPageChange =
    activeTab === "pending"
      ? onPendingPageChange
      : activeTab === "inProgress"
        ? onInProgressPageChange
        : onDonePageChange;

  return (
    <div className="todos-content">
      {/* Header section with title */}
      <div className="todos-header">
        <h2>Your Todos</h2>
      </div>

      {/* Input field for adding new todos */}
      <TodoInput onAdd={onAdd} />

      {/* Container with flex layout: tabs on left, pagination on right */}
      <div
        style={{
          display: "flex", // Use flexbox
          justifyContent: "space-between", // Spread items to left and right edges
          alignItems: "center", // Vertically center items
        }}
      >
        {/* Tab buttons to switch between Pending, InProgress, and Done views */}
        <div className="todo-tabs">
          {/* Pending Tasks tab - shows "active" class when selected */}
          <button
            type="button"
            className={`todo-tab${activeTab === "pending" ? " active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>

          {/* InProgress Tasks tab - shows "active" class when selected */}
          <button
            type="button"
            className={`todo-tab${activeTab === "inProgress" ? " active" : ""}`}
            onClick={() => setActiveTab("inProgress")}
          >
            InProgress
          </button>

          {/* Done Tasks tab - shows "active" class when selected */}
          <button
            type="button"
            className={`todo-tab${activeTab === "done" ? " active" : ""}`}
            onClick={() => setActiveTab("done")}
          >
            Done
          </button>
        </div>

        {/* Pagination controls (Previous, page info, Next) */}
        <div className="pagination">
          {/* Previous button - disabled if already on page 1 */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoBack}
            aria-label="Previous page"
          >
            Prev
          </button>

          {/* Display current page and total pages (e.g., "Page 2 of 5") */}
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next button - disabled if already on last page */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoForward}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>

      {/* Display the todo list for the active tab */}
      <TodoList todos={listTodos} onToggleDone={onToggleDone} />
    </div>
  );
}

export default TodosPage;
