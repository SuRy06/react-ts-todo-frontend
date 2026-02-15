import { useMemo, useState } from "react";
import {
  TodosDocument,
  type TodosQuery,
  type TodoStatus,
  useCreateTodoMutation,
  useRemoveTodoMutation,
  useTodosQuery,
  useUpdateTodoStatusMutation,
} from "../services/graphql/generated/graphql";

// Status buckets used by each tab.
const PENDING_STATUSES: TodoStatus = "UNDONE";
const IN_PROGRESS_STATUSES: TodoStatus = "INPROGRESS";
const DONE_STATUSES: TodoStatus = "DONE";

// Contract returned by useTodos: data buckets, pagination, and actions.
type UseTodosResult = {
  pendingTodos: TodosQuery["todos"]["items"]; // Todos in UNDONE status.
  inProgressTodos: TodosQuery["todos"]["items"]; // Todos in INPROGRESS status.
  doneTodos: TodosQuery["todos"]["items"]; // Todos in DONE status.
  pendingTotalCount: number; // Total count for pending tab.
  inProgressTotalCount: number; // Total count for in-progress tab.
  doneTotalCount: number; // Total count for done tab.
  pendingPage: number; // Current page index (1-based) for pending tab.
  inProgressPage: number; // Current page index (1-based) for in-progress tab.
  donePage: number; // Current page index (1-based) for done tab.
  setPendingPage: (page: number) => void; // Page setter for pending tab.
  setInProgressPage: (page: number) => void; // Page setter for in-progress tab.
  setDonePage: (page: number) => void; // Page setter for done tab.
  isLoading: boolean; // True if any tab query is loading.
  displayedErrorMessage: string | null; // Consolidated error message.
  allTodos: TodosQuery["todos"]["items"]; // Flattened list across tabs.
  handleAddTodo: (text: string) => Promise<void>; // Create a new todo.
  handleDeleteTodo: (id: string) => Promise<void>; // Remove a todo by id.
  updateTodoStatus: (id: string, status: TodoStatus) => Promise<void>; // Toggle status.
};

const useTodos = (pageSize: number): UseTodosResult => {
  // Local UI state: pagination and user-facing error fallback.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingPage, setPendingPage] = useState(1);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [donePage, setDonePage] = useState(1);

  // Build query variables per tab, memoized to keep cache keys stable.
  // This lets Apollo cache each tab independently by its variables.
  const pendingSkip = (pendingPage - 1) * pageSize;
  const pendingVariables = useMemo(
    () => ({
      skip: pendingSkip,
      take: pageSize,
      statuses: PENDING_STATUSES,
    }),
    [pendingSkip, pageSize],
  );

  // Each tab gets its own paging offset.
  const inProgressSkip = (inProgressPage - 1) * pageSize;
  const inProgressVariables = useMemo(
    () => ({
      skip: inProgressSkip,
      take: pageSize,
      statuses: IN_PROGRESS_STATUSES,
    }),
    [inProgressSkip, pageSize],
  );

  const doneSkip = (donePage - 1) * pageSize;
  const doneVariables = useMemo(
    () => ({
      skip: doneSkip,
      take: pageSize,
      statuses: DONE_STATUSES,
    }),
    [doneSkip, pageSize],
  );

  // Run three queries in parallel for each status bucket.
  // That keeps all tabs fresh when the user switches between them.
  const {
    data: pendingData,
    loading: pendingLoading,
    error: pendingError,
  } = useTodosQuery({
    variables: pendingVariables,
  });

  const {
    data: inProgressData,
    loading: inProgressLoading,
    error: inProgressError,
  } = useTodosQuery({
    variables: inProgressVariables,
  });

  const {
    data: doneData,
    loading: doneLoading,
    error: doneError,
  } = useTodosQuery({
    variables: doneVariables,
  });

  // Mutations update the cache so the UI updates without refetching.
  // Each update block only touches the relevant cached query.
  const [createTodoMutation] = useCreateTodoMutation({
    update(cache, result) {
      const created = result.data?.createTodo; // New todo returned by the mutation.
      if (!created) {
        return;
      }

      // Insert new todo at the top of the pending list on page 1.
      const existing = cache.readQuery<TodosQuery>({
        query: TodosDocument,
        variables: pendingVariables,
      });
      const previous = existing?.todos.items ?? []; // Current cached page items.
      const nextItems =
        pendingSkip === 0
          ? [created, ...previous].slice(0, pageSize) // Prepend only on page 1.
          : previous; // Keep other pages intact.
      const nextTotal = (existing?.todos.totalCount ?? 0) + 1; // Optimistic total count.

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

  const [updateTodoMutation] = useUpdateTodoStatusMutation({
    update(cache, result) {
      const updated = result.data?.updateTodo;
      if (!updated) {
        return;
      }

      // Read each bucket cache to reconcile the todo across tabs.
      const pendingExisting = cache.readQuery<TodosQuery>({
        query: TodosDocument,
        variables: pendingVariables,
      });
      const inProgressExisting = cache.readQuery<TodosQuery>({
        query: TodosDocument,
        variables: inProgressVariables,
      });
      const doneExisting = cache.readQuery<TodosQuery>({
        query: TodosDocument,
        variables: doneVariables,
      });

      const pendingItems = pendingExisting?.todos.items ?? [];
      const inProgressItems = inProgressExisting?.todos.items ?? [];
      const doneItems = doneExisting?.todos.items ?? [];

      const pendingHas = pendingItems.some((todo) => todo.id === updated.id);
      const inProgressHas = inProgressItems.some(
        (todo) => todo.id === updated.id,
      );
      const doneHas = doneItems.some((todo) => todo.id === updated.id);

      // Build the next cache snapshot for a single bucket.
      const buildNext = ({
        existing,
        items,
        has,
        matchesStatus,
        skip,
      }: {
        existing: TodosQuery | null | undefined;
        items: TodosQuery["todos"]["items"];
        has: boolean;
        matchesStatus: boolean;
        skip: number;
      }) => {
        if (!existing) {
          return null;
        }

        const currentTotal = existing.todos.totalCount ?? 0;

        // If the todo now belongs in this bucket, insert/update accordingly.
        if (matchesStatus) {
          const nextItems =
            skip === 0
              ? [
                  updated,
                  ...items.filter((todo) => todo.id !== updated.id),
                ].slice(0, pageSize)
              : has
                ? items.map((todo) => (todo.id === updated.id ? updated : todo))
                : items;
          const nextTotal = has ? currentTotal : currentTotal + 1;
          return { items: nextItems, totalCount: nextTotal };
        }

        // Otherwise, remove it if it was previously in this bucket.
        const nextItems = has
          ? items.filter((todo) => todo.id !== updated.id)
          : items;
        const nextTotal = has ? Math.max(0, currentTotal - 1) : currentTotal;
        return { items: nextItems, totalCount: nextTotal };
      };

      const pendingNext = buildNext({
        existing: pendingExisting,
        items: pendingItems,
        has: pendingHas,
        matchesStatus: updated.status === PENDING_STATUSES,
        skip: pendingSkip,
      });

      const inProgressNext = buildNext({
        existing: inProgressExisting,
        items: inProgressItems,
        has: inProgressHas,
        matchesStatus: updated.status === IN_PROGRESS_STATUSES,
        skip: inProgressSkip,
      });

      const doneNext = buildNext({
        existing: doneExisting,
        items: doneItems,
        has: doneHas,
        matchesStatus: updated.status === DONE_STATUSES,
        skip: doneSkip,
      });

      // Write back only for buckets that have a cache entry.
      if (pendingExisting && pendingNext) {
        cache.writeQuery<TodosQuery>({
          query: TodosDocument,
          variables: pendingVariables,
          data: {
            todos: {
              __typename: "TodoPage",
              items: pendingNext.items,
              totalCount: pendingNext.totalCount,
            },
          },
        });
      }

      if (inProgressExisting && inProgressNext) {
        cache.writeQuery<TodosQuery>({
          query: TodosDocument,
          variables: inProgressVariables,
          data: {
            todos: {
              __typename: "TodoPage",
              items: inProgressNext.items,
              totalCount: inProgressNext.totalCount,
            },
          },
        });
      }

      if (doneExisting && doneNext) {
        cache.writeQuery<TodosQuery>({
          query: TodosDocument,
          variables: doneVariables,
          data: {
            todos: {
              __typename: "TodoPage",
              items: doneNext.items,
              totalCount: doneNext.totalCount,
            },
          },
        });
      }
    },
  });

  const [removeTodoMutation] = useRemoveTodoMutation({
    update(cache, result, options) {
      const removedMessage = result.data?.removeTodo;
      const removedId = options.variables?.removeTodoId;
      if (!removedMessage || !removedId) {
        return;
      }

      // Backend returns a message only, so rely on the mutation variables.
      const removeFromCache = (variables: {
        skip: number;
        take: number;
        statuses: TodoStatus;
      }) => {
        const existing = cache.readQuery<TodosQuery>({
          query: TodosDocument,
          variables,
        });
        if (!existing) {
          return;
        }

        const items = existing.todos.items;
        const hasTodo = items.some((todo) => todo.id === removedId);
        if (!hasTodo) {
          return;
        }

        // Remove the item and decrement totalCount for this bucket.
        cache.writeQuery<TodosQuery>({
          query: TodosDocument,
          variables,
          data: {
            todos: {
              __typename: "TodoPage",
              items: items.filter((todo) => todo.id !== removedId),
              totalCount: Math.max(0, existing.todos.totalCount - 1),
            },
          },
        });
      };

      // Clean up the todo from whichever bucket currently contains it.
      removeFromCache(pendingVariables);
      removeFromCache(inProgressVariables);
      removeFromCache(doneVariables);
    },
  });

  // Normalize results for the UI layer.
  const pendingTodos = pendingData?.todos.items ?? [];
  const inProgressTodos = inProgressData?.todos.items ?? [];
  const doneTodos = doneData?.todos.items ?? [];
  const pendingTotalCount = pendingData?.todos.totalCount ?? 0;
  const inProgressTotalCount = inProgressData?.todos.totalCount ?? 0;
  const doneTotalCount = doneData?.todos.totalCount ?? 0;
  // Aggregate list for cross-tab lookups (e.g. passcode status toggle).
  const allTodos = useMemo(
    () => [...pendingTodos, ...inProgressTodos, ...doneTodos],
    [pendingTodos, inProgressTodos, doneTodos],
  );
  const isLoading = pendingLoading || inProgressLoading || doneLoading;
  const displayedErrorMessage =
    pendingError?.message ??
    inProgressError?.message ??
    doneError?.message ??
    errorMessage;

  // Public actions used by the page.
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

  const handleDeleteTodo = async (id: string) => {
    try {
      await removeTodoMutation({
        variables: { removeTodoId: id },
      });
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete todo",
      );
    }
  };

  const updateTodoStatus = async (id: string, status: TodoStatus) => {
    try {
      await updateTodoMutation({
        variables: { id, status },
      });
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update todo",
      );
    }
  };

  return {
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
  };
};

export default useTodos;
