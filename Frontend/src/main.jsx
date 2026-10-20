import { createRoot } from "react-dom/client";
import {Provider} from "react-redux";

import "./index.css";
import { App } from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
<<<<<<< HEAD
import { Provider } from "react-redux";
import { timeflow_Store } from "./Store/Store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={timeflow_Store}>
=======
import { store } from "./Redux/Store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
>>>>>>> dd6ce12be3941927b0abe39750686ccae55448b5
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
