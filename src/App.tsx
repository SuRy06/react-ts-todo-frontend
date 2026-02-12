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
  type TodoStatus,
  useCreateTodoMutation,
  useTodosQuery,
  useUpdateTodoStatusMutation,
} from "./services/graphql/generated/graphql";

// Simple passcode gate for toggling todo status.
const CORRECT_PASSCODE = "1234";
const PAGE_SIZE = 10;
const PENDING_STATUSES: TodoStatus[] = ["UNDONE", "INPROGRESS"];
const DONE_STATUSES: TodoStatus[] = ["DONE"];

function App() {
  // UI state for the passcode modal and any pending toggle action.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  // Local error state to supplement GraphQL errors.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Pagination state for each tab.
  const [pendingPage, setPendingPage] = useState(1);
  const [donePage, setDonePage] = useState(1);

  // Fetch pending todos.
  const pendingSkip = (pendingPage - 1) * PAGE_SIZE;
  const pendingVariables = {
    skip: pendingSkip,
    take: PAGE_SIZE,
    statuses: PENDING_STATUSES,
  };
  const {
    data: pendingData,
    loading: pendingLoading,
    error: pendingError,
  } = useTodosQuery({
    variables: pendingVariables,
  });

  // Fetch done todos.
  const doneSkip = (donePage - 1) * PAGE_SIZE;
  const doneVariables = {
    skip: doneSkip,
    take: PAGE_SIZE,
    statuses: DONE_STATUSES,
  };
  const {
    data: doneData,
    loading: doneLoading,
    error: doneError,
  } = useTodosQuery({
    variables: doneVariables,
  });
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
        variables: pendingVariables,
      });
      const previous = existing?.todos.items ?? [];
      const nextItems =
        pendingSkip === 0
          ? [created, ...previous].slice(0, PAGE_SIZE)
          : previous;
      const nextTotal = (existing?.todos.totalCount ?? 0) + 1;

      cache.writeQuery<TodosQuery>({
        query: TodosDocument,
        variables: pendingVariables,
        data: {
          todos: {
            __typename: "TodoPage",
            items: nextItems,
            totalCount: nextTotal,
          },
        },
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
      const pendingExisting = cache.readQuery<TodosQuery>({
        query: TodosDocument,
        variables: pendingVariables,
      });
      const doneExisting = cache.readQuery<TodosQuery>({
        query: TodosDocument,
        variables: doneVariables,
      });

      const pendingItems = pendingExisting?.todos.items ?? [];
      const doneItems = doneExisting?.todos.items ?? [];
      const pendingHas = pendingItems.some((todo) => todo.id === updated.id);
      const doneHas = doneItems.some((todo) => todo.id === updated.id);

      if (updated.status === "DONE") {
        const nextPendingItems = pendingHas
          ? pendingItems.filter((todo) => todo.id !== updated.id)
          : pendingItems;
        const nextPendingTotal = pendingHas
          ? Math.max(0, (pendingExisting?.todos.totalCount ?? 0) - 1)
          : (pendingExisting?.todos.totalCount ?? 0);

        const nextDoneItems =
          doneSkip === 0
            ? [
                updated,
                ...doneItems.filter((todo) => todo.id !== updated.id),
              ].slice(0, PAGE_SIZE)
            : doneItems;
        const nextDoneTotal = doneHas
          ? (doneExisting?.todos.totalCount ?? 0)
          : (doneExisting?.todos.totalCount ?? 0) + 1;

        if (pendingExisting) {
          cache.writeQuery<TodosQuery>({
            query: TodosDocument,
            variables: pendingVariables,
            data: {
              todos: {
                __typename: "TodoPage",
                items: nextPendingItems,
                totalCount: nextPendingTotal,
              },
            },
          });
        }

        if (doneExisting) {
          cache.writeQuery<TodosQuery>({
            query: TodosDocument,
            variables: doneVariables,
            data: {
              todos: {
                __typename: "TodoPage",
                items: nextDoneItems,
                totalCount: nextDoneTotal,
              },
            },
          });
        }

        return;
      }

      const nextPendingItems =
        pendingSkip === 0
          ? [
              updated,
              ...pendingItems.filter((todo) => todo.id !== updated.id),
            ].slice(0, PAGE_SIZE)
          : pendingHas
            ? pendingItems.map((todo) =>
                todo.id === updated.id ? updated : todo,
              )
            : pendingItems;
      const nextPendingTotal = pendingHas
        ? (pendingExisting?.todos.totalCount ?? 0)
        : (pendingExisting?.todos.totalCount ?? 0) + 1;

      const nextDoneItems = doneHas
        ? doneItems.filter((todo) => todo.id !== updated.id)
        : doneItems;
      const nextDoneTotal = doneHas
        ? Math.max(0, (doneExisting?.todos.totalCount ?? 0) - 1)
        : (doneExisting?.todos.totalCount ?? 0);

      if (pendingExisting) {
        cache.writeQuery<TodosQuery>({
          query: TodosDocument,
          variables: pendingVariables,
          data: {
            todos: {
              __typename: "TodoPage",
              items: nextPendingItems,
              totalCount: nextPendingTotal,
            },
          },
        });
      }

      if (doneExisting) {
        cache.writeQuery<TodosQuery>({
          query: TodosDocument,
          variables: doneVariables,
          data: {
            todos: {
              __typename: "TodoPage",
              items: nextDoneItems,
              totalCount: nextDoneTotal,
            },
          },
        });
      }
    },
  });

  // Normalize data for rendering.
  const pendingTodos = pendingData?.todos.items ?? [];
  const doneTodos = doneData?.todos.items ?? [];
  const pendingTotalCount = pendingData?.todos.totalCount ?? 0;
  const doneTotalCount = doneData?.todos.totalCount ?? 0;
  const allTodos = [...pendingTodos, ...doneTodos];
  const isLoading = pendingLoading || doneLoading;
  const displayedErrorMessage =
    pendingError?.message ?? doneError?.message ?? errorMessage;

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
    const current = allTodos.find((todo) => todo.id === pendingToggleId);
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
                pendingTodos={pendingTodos}
                doneTodos={doneTodos}
                onAdd={handleAddTodo}
                onToggleDone={handleToggleRequest}
                pageSize={PAGE_SIZE}
                pendingPage={pendingPage}
                donePage={donePage}
                pendingTotalCount={pendingTotalCount}
                doneTotalCount={doneTotalCount}
                onPendingPageChange={(nextPage) => setPendingPage(nextPage)}
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
