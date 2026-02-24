import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header.tsx";
import PasscodeModal from "./components/modals/PasscodeModal.tsx";
import HomePage from "./pages/HomePage.tsx";
import TodosPage from "./pages/TodosPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { Routes, Route } from "react-router-dom";
import useTodos from "./hooks/useTodos.ts";
import type { TodoStatus } from "./services/graphql/generated/graphql";

// Simple passcode gate for toggling todo status.
const CORRECT_PASSCODE = "1234";
const PAGE_SIZE = 10;

function App() {
  // UI state for the passcode modal and any pending toggle action.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggle, setToggle] = useState<{
    id: string;
    status: TodoStatus;
  } | null>(null);
  const {
    pendingTodos,
    inProgressTodos,
    doneTodos,
    pendingTotalCount,
    inProgressTotalCount,
    doneTotalCount,
    pendingPage,
    inProgressPage,
    donePage,
    setPendingPage,
    setInProgressPage,
    setDonePage,
    isLoading,
    displayedErrorMessage,
    allTodos,
    handleAddTodo,
    handleDeleteTodo,
    updateTodoStatus,
  } = useTodos(PAGE_SIZE);

  // Open passcode modal before allowing a status toggle.
  const handleToggleRequest = (id: string, status: TodoStatus) => {
    setToggle({ id, status });
    setIsModalOpen(true);
  };

  // Validate passcode and perform the status toggle.
  const handlePasscodeSubmit = async (passcode: string) => {
    if (passcode !== CORRECT_PASSCODE || toggle === null) {
      return;
    }

    // Look up the current todo to determine next status.
    const current = allTodos.find((todo) => todo.id === toggle.id);
    if (!current) {
      return;
    }

    // Cycle: DONE → INPROGRESS → UNDONE → DONE
    const nextStatus: TodoStatus =
      current.status === "UNDONE"
        ? "INPROGRESS"
        : current.status === "INPROGRESS"
          ? "DONE"
          : "UNDONE";

    await updateTodoStatus(toggle.id, nextStatus);
    setIsModalOpen(false);
    setToggle(null);
  };

  // Close modal and clear any pending toggle.
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setToggle(null);
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
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/todos"
            element={
              <TodosPage
                pendingTodos={pendingTodos}
                inProgressTodos={inProgressTodos}
                doneTodos={doneTodos}
                onAdd={handleAddTodo}
                onToggle={handleToggleRequest}
                onDelete={handleDeleteTodo}
                pageSize={PAGE_SIZE}
                pendingPage={pendingPage}
                inProgressPage={inProgressPage}
                donePage={donePage}
                pendingTotalCount={pendingTotalCount}
                inProgressTotalCount={inProgressTotalCount}
                doneTotalCount={doneTotalCount}
                onPendingPageChange={(nextPage) => setPendingPage(nextPage)}
                onInProgressPageChange={(nextPage) =>
                  setInProgressPage(nextPage)
                }
                onDonePageChange={(nextPage) => setDonePage(nextPage)}
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
