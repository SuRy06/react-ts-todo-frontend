import type { Todo, TodoStatus } from "../types/index.ts";

const DEFAULT_GRAPHQL_URL = "http://localhost:3000/graphql";

const GRAPHQL_URL =
  (import.meta as ImportMeta).env?.VITE_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const body = (await response.json()) as GraphqlResponse<T>;
  if (!response.ok || body.errors?.length) {
    const message = body.errors?.[0]?.message ?? "Request failed";
    throw new Error(message);
  }
  if (!body.data) {
    throw new Error("No data returned from API");
  }
  return body.data;
}

export async function fetchTodos(): Promise<Todo[]> {
  const query = `
    query Todos {
      todos {
        id
        name
        status
        createdAt
        updatedAt
      }
    }
  `;

  const data = await graphqlRequest<{ todos: Todo[] }>(query);
  return data.todos;
}

export async function createTodo(name: string): Promise<Todo> {
  const mutation = `
    mutation CreateTodo($name: String!) {
      createTodo(createTodoInput: { name: $name }) {
        id
        name
        status
        createdAt
        updatedAt
      }
    }
  `;

  const data = await graphqlRequest<{ createTodo: Todo }>(mutation, { name });
  return data.createTodo;
}

export async function updateTodoStatus(
  id: string,
  status: TodoStatus,
): Promise<Todo> {
  const mutation = `
    mutation UpdateTodoStatus($id: String!, $status: TodoStatus!) {
      updateTodo(updateTodoInput: { id: $id, status: $status }) {
        id
        name
        status
        createdAt
        updatedAt
      }
    }
  `;

  const data = await graphqlRequest<{ updateTodo: Todo }>(mutation, {
    id,
    status,
  });
  return data.updateTodo;
}
