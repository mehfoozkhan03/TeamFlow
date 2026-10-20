import { createRoot } from "react-dom/client";
import {Provider} from "react-redux";

import "./index.css";
import { App } from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { timeflow_Store } from "./Store/Store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={timeflow_Store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
