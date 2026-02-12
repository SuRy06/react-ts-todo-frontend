import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header.tsx";
import PasscodeModal from "./components/PasscodeModal.tsx";
import HomePage from "./pages/HomePage.tsx";
import TodosPage from "./pages/TodosPage.tsx";
import type { Todo } from "./types/index.ts";
import { createTodo, fetchTodos, updateTodoStatus } from "./api/todosApi.ts";
import { Routes, Route } from "react-router-dom";

const CORRECT_PASSCODE = "1234";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchTodos()
      .then((items) => {
        if (isMounted) {
          setTodos(items);
          setErrorMessage(null);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load todos",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddTodo = async (text: string) => {
    try {
      const created = await createTodo(text);
      setTodos((previous) => [...previous, created]);
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add todo",
      );
    }
  };

  const handleToggleRequest = (id: string) => {
    setPendingToggleId(id);
    setIsModalOpen(true);
  };

  const handlePasscodeSubmit = async (passcode: string) => {
    if (passcode !== CORRECT_PASSCODE || pendingToggleId === null) {
      return;
    }

    const current = todos.find((todo) => todo.id === pendingToggleId);
    if (!current) {
      return;
    }

    const nextStatus = current.status === "DONE" ? "UNDONE" : "DONE";

    try {
      const updated = await updateTodoStatus(pendingToggleId, nextStatus);
      setTodos((previous) =>
        previous.map((todo) => (todo.id === updated.id ? updated : todo)),
      );
      setErrorMessage(null);
      setIsModalOpen(false);
      setPendingToggleId(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update todo",
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingToggleId(null);
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="content">
        {isLoading && <p className="status-text">Loading todos...</p>}
        {errorMessage && <p className="status-text error">{errorMessage}</p>}
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
