import React from "react";
import * as ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import Application from "./Application";

class WebComponentWrapper extends React.Component<{}, {}> {
  render() {
    const w = window as any;
    const config: ApplicationContext = {
      shop: w.Shopify.shop,
      api: w.Shopify.api,
      productId: w.Shopify.productId,
    };
    return <Application config={config} />;
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
