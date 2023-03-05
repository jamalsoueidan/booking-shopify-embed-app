import React from "react";
import ReactDOM from "react-dom/client";
import Application from "./application";

import "@jamalsoueidan/frontend.polyfills.json";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
