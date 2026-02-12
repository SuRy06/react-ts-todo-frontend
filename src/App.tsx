import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header.tsx";
import PasscodeModal from "./components/modals/PasscodeModal.tsx";
import HomePage from "./pages/HomePage.tsx";
import TodosPage from "./pages/TodosPage.tsx";
import { Routes, Route } from "react-router-dom";
import {
  TodosDocument,
  type TodosQuery,
  useCreateTodoMutation,
  useTodosQuery,
  useUpdateTodoStatusMutation,
} from "./services/graphql/generated/graphql";

// Simple passcode gate for toggling todo status.
const CORRECT_PASSCODE = "1234";

function App() {
  // UI state for the passcode modal and any pending toggle action.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  // Local error state to supplement GraphQL errors.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch todos from the GraphQL API.
  const { data, loading, error } = useTodosQuery();
  // Create todo mutation with cache update for instant UI feedback.
  const [createTodoMutation] = useCreateTodoMutation({
    update(cache, result) {
      const created = result.data?.createTodo;
      if (!created) {
        return;
      }

      // Merge the new todo into the existing cached list.
      const existing = cache.readQuery<TodosQuery>({
        query: TodosDocument,
      });
      const previous = existing?.todos ?? [];
      cache.writeQuery<TodosQuery>({
        query: TodosDocument,
        data: { todos: [...previous, created] },
      });
    },
  });
  // Update todo status mutation with cache sync.
  const [updateTodoMutation] = useUpdateTodoStatusMutation({
    update(cache, result) {
      const updated = result.data?.updateTodo;
      if (!updated) {
        return;
      }

      // Replace the updated todo in the cached list.
      const existing = cache.readQuery<TodosQuery>({
        query: TodosDocument,
      });
      if (!existing?.todos) {
        return;
      }

      cache.writeQuery<TodosQuery>({
        query: TodosDocument,
        data: {
          todos: existing.todos.map((todo) =>
            todo.id === updated.id ? updated : todo,
          ),
        },
      });
    },
  });

  // Normalize data for rendering.
  const todos = data?.todos ?? [];
  const isLoading = loading;
  const displayedErrorMessage = error?.message ?? errorMessage;

  // Create a new todo and handle any errors.
  const handleAddTodo = async (text: string) => {
    try {
      await createTodoMutation({
        variables: { name: text },
      });
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add todo",
      );
    }
  };

  // Open passcode modal before allowing a status toggle.
  const handleToggleRequest = (id: string) => {
    setPendingToggleId(id);
    setIsModalOpen(true);
  };

  // Validate passcode and perform the status toggle.
  const handlePasscodeSubmit = async (passcode: string) => {
    if (passcode !== CORRECT_PASSCODE || pendingToggleId === null) {
      return;
    }

    // Look up the current todo to determine next status.
    const current = todos.find((todo) => todo.id === pendingToggleId);
    if (!current) {
      return;
    }

    // Toggle DONE <-> UNDONE.
    const nextStatus = current.status === "DONE" ? "UNDONE" : "DONE";

    try {
      await updateTodoMutation({
        variables: {
          id: pendingToggleId,
          status: nextStatus,
        },
      });
      setErrorMessage(null);
      setIsModalOpen(false);
      setPendingToggleId(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update todo",
      );
    }
  };

  // Close modal and clear any pending toggle.
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingToggleId(null);
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="content">
        {isLoading && <p className="status-text">Loading todos...</p>}
        {displayedErrorMessage && (
          <p className="status-text error">{displayedErrorMessage}</p>
        )}
        <Routes>
          <Route path="/" element={<HomePage onAdd={handleAddTodo} />} />
          <Route
            path="/todos"
            element={
              <TodosPage
                todos={todos}
                onAdd={handleAddTodo}
                onToggleDone={handleToggleRequest}
              />
            }
          />
        </Routes>
      </main>
      <PasscodeModal
        isOpen={isModalOpen}
        onSubmit={handlePasscodeSubmit}
        onCancel={handleModalCancel}
      />
    </div>
  );
}

export default App;
