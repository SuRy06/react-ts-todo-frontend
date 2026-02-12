import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const DEFAULT_GRAPHQL_URL = "http://localhost:3000/graphql";

const GRAPHQL_URL =
  (import.meta as ImportMeta).env?.VITE_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
  }),
  cache: new InMemoryCache(),
});
