import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ThemeProvider } from "./theme/ThemeContext.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import { seedIfEmpty } from "./data/users.js";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/pages.css";

// Create the demo accounts on the very first run, then start the app.
seedIfEmpty().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
});
