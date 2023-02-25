import React from "react";
import ReactDOM from "react-dom/client";
import Application from "./application";

import "@jamalsoueidan/bsf.polyfills.json";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
