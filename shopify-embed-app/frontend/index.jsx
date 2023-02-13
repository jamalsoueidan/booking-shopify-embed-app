import React from "react";
import ReactDOM from "react-dom/client";
import Application from "./application";

/* eslint-disable prefer-const */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
let reISO =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
let { parse } = JSON;

function dateParser(key, value) {
  if (typeof value === "string") {
    let a = reISO.exec(value);
    if (a) {
      return new Date(value);
    }
  }
  return value;
}

// eslint-disable-next-line func-names
JSON.parse = function (data) {
  return parse(data, dateParser);
};

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
