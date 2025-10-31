import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";

import Login from "./pages/Login";
import App from "./App";
import "./index.css";

// Гейт теперь использует контекст (а не react-firebase-hooks прямо)
function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
