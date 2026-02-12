import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type CreateTodoInput = {
  /** The name of the todo item */
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: Todo;
  removeTodo: Todo;
  updateTodo: Todo;
};


export type MutationCreateTodoArgs = {
  createTodoInput: CreateTodoInput;
};


export type MutationRemoveTodoArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateTodoArgs = {
  updateTodoInput: UpdateTodoInput;
};

export type Query = {
  __typename?: 'Query';
  todo: Todo;
  todos: Array<Todo>;
};


export type QueryTodoArgs = {
  id: Scalars['String']['input'];
};

export type Todo = {
  __typename?: 'Todo';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: TodoStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** Current status of a todo item */
export type TodoStatus =
  | 'DONE'
  | 'INPROGRESS'
  | 'UNDONE';

export type UpdateTodoInput = {
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TodoStatus>;
};

export type TodosQueryVariables = Exact<{ [key: string]: never; }>;


export type TodosQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'Todo', id: string, name: string, status: TodoStatus, createdAt: string, updatedAt: string }> };

export type CreateTodoMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', createTodo: { __typename?: 'Todo', id: string, name: string, status: TodoStatus, createdAt: string, updatedAt: string } };

export type UpdateTodoStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
  status: TodoStatus;
}>;


export type UpdateTodoStatusMutation = { __typename?: 'Mutation', updateTodo: { __typename?: 'Todo', id: string, name: string, status: TodoStatus, createdAt: string, updatedAt: string } };


export const TodosDocument = gql`
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

/**
 * __useTodosQuery__
 *
 * To run a query within a React component, call `useTodosQuery` and pass it any options that fit your needs.
 * When your component renders, `useTodosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodosQuery({
 *   variables: {
 *   },
 * });
 */
export function useTodosQuery(baseOptions?: Apollo.QueryHookOptions<TodosQuery, TodosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TodosQuery, TodosQueryVariables>(TodosDocument, options);
      }
export function useTodosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TodosQuery, TodosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TodosQuery, TodosQueryVariables>(TodosDocument, options);
        }
// @ts-ignore
export function useTodosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TodosQuery, TodosQueryVariables>): Apollo.UseSuspenseQueryResult<TodosQuery, TodosQueryVariables>;
export function useTodosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TodosQuery, TodosQueryVariables>): Apollo.UseSuspenseQueryResult<TodosQuery | undefined, TodosQueryVariables>;
export function useTodosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TodosQuery, TodosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TodosQuery, TodosQueryVariables>(TodosDocument, options);
        }
export type TodosQueryHookResult = ReturnType<typeof useTodosQuery>;
export type TodosLazyQueryHookResult = ReturnType<typeof useTodosLazyQuery>;
export type TodosSuspenseQueryHookResult = ReturnType<typeof useTodosSuspenseQuery>;
export type TodosQueryResult = Apollo.QueryResult<TodosQuery, TodosQueryVariables>;
export const CreateTodoDocument = gql`
    mutation CreateTodo($name: String!) {
  createTodo(createTodoInput: {name: $name}) {
    id
    name
    status
    createdAt
    updatedAt
  }
}
    `;
export type CreateTodoMutationFn = Apollo.MutationFunction<CreateTodoMutation, CreateTodoMutationVariables>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTodoMutation(baseOptions?: Apollo.MutationHookOptions<CreateTodoMutation, CreateTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, options);
      }
export type CreateTodoMutationHookResult = ReturnType<typeof useCreateTodoMutation>;
export type CreateTodoMutationResult = Apollo.MutationResult<CreateTodoMutation>;
export type CreateTodoMutationOptions = Apollo.BaseMutationOptions<CreateTodoMutation, CreateTodoMutationVariables>;
export const UpdateTodoStatusDocument = gql`
    mutation UpdateTodoStatus($id: String!, $status: TodoStatus!) {
  updateTodo(updateTodoInput: {id: $id, status: $status}) {
    id
    name
    status
    createdAt
    updatedAt
  }
}
    `;
export type UpdateTodoStatusMutationFn = Apollo.MutationFunction<UpdateTodoStatusMutation, UpdateTodoStatusMutationVariables>;

/**
 * __useUpdateTodoStatusMutation__
 *
 * To run a mutation, you first call `useUpdateTodoStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTodoStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTodoStatusMutation, { data, loading, error }] = useUpdateTodoStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateTodoStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTodoStatusMutation, UpdateTodoStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTodoStatusMutation, UpdateTodoStatusMutationVariables>(UpdateTodoStatusDocument, options);
      }
export type UpdateTodoStatusMutationHookResult = ReturnType<typeof useUpdateTodoStatusMutation>;
export type UpdateTodoStatusMutationResult = Apollo.MutationResult<UpdateTodoStatusMutation>;
export type UpdateTodoStatusMutationOptions = Apollo.BaseMutationOptions<UpdateTodoStatusMutation, UpdateTodoStatusMutationVariables>;