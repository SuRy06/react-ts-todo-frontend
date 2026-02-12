import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./services/apollo/apolloClient.ts";

// Mount the React app and compose providers for global concerns.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Apollo provides GraphQL client access to the entire component tree. */}
    <ApolloProvider client={apolloClient}>
      {/* AuthProvider manages sign-in state and local persistence. */}
      <AuthProvider>
        {/* Router enables page navigation within the SPA. */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
);
