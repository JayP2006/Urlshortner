import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="app-aura" aria-hidden />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-elev)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.4)",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
