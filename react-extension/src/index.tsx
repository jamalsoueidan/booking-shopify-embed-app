import React from "react";
import * as ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import App from "./App";

class WebComponentWrapper extends React.Component<{}, {}> {
  render() {
    const w = window as any;
    console.log(w.Shopify);
    const config: Config = {
      shop: w.Shopify.shop,
      api: w.Shopify.api,
      productId: w.Shopify.productId,
    };
    return <App config={config} />;
  }
}

const bookAppointmentExt = reactToWebComponent(
  WebComponentWrapper,
  React,
  ReactDOM,
  {
    dashStyleAttributes: true,
  }
);
const bookAppointmentExtShadow = reactToWebComponent(
  WebComponentWrapper,
  React,
  ReactDOM,
  { dashStyleAttributes: true, shadow: true }
);

customElements.define("book-appointment-ext", bookAppointmentExt);
customElements.define("book-appointment-ext-shadow", bookAppointmentExtShadow);
