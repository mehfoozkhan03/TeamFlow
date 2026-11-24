import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { App } from "./App.jsx";
import { timeflow_Store } from "./Store/Store.js";
import { ThemeProvider } from "./Context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <Provider store={timeflow_Store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
