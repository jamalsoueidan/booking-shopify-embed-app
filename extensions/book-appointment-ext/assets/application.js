(function () {
  const tagName = "wizard-application";
  if (!customElements.get(tagName)) {
    //https://web.dev/custom-elements-v1/
    customElements.define(
      tagName,
      class extends HTMLElement {
        products = new Set();
        date = null;
        currentStep = 0;

        constructor() {
          super();

          this.addEventListener("add-product", (event) => {
            this.products.add(event.detail.payload);
          });

          this.addEventListener("remove-product", (event) => {
            this.products.delete(event.detail.payload);
          });

          this.addEventListener("calendar", (event) => {
            this.date = event.detail.payload;
          });

          this.steps = this.querySelectorAll("wizard-step");

          const button = this.querySelector("#submit");
          button.addEventListener("click", () => {
            const product = [...this.products][0];
            const config = fetchConfig("javascript");
            config.headers["X-Requested-With"] = "XMLHttpRequest";
            delete config.headers["Content-Type"];
            const formData = new FormData();
            formData.append("quantity", "1");
            formData.append("form_type", "product");
            formData.append("id", product.variants[0].id);
            formData.append("properties[staff]", "testerne");
            formData.append("properties[datetime]", this.date.join(""));
            config.body = formData;
            fetch(routes.cart_add_url, config)
              .then((response) => {
                console.log(response.json());
              })
              .catch((e) => {
                console.error(e);
              })
              .finally(() => {
                console.log("finish");
              });
          });
        }
      }
    );
  }
})();
