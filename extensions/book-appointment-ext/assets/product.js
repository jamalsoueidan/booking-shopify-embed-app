(function () {
  const tagName = "wizard-product";
  if (!customElements.get(tagName)) {
    //https://web.dev/custom-elements-v1/
    customElements.define(
      tagName,
      class extends HTMLElement {
        product = null;
        image = null;
        added = false;

        constructor() {
          super();
          this.addEventListener("click", this.click.bind(this));
        }

        click(event) {
          this.added = !this.added;
          if (this.added) {
            this.setAttribute("class", "added");
          } else {
            this.removeAttribute("class");
          }

          this.dispatchEvent(
            new CustomEvent(this.added ? "add-product" : "remove-product", {
              bubbles: true,
              composed: true,
              detail: {
                payload: this.product,
              },
            })
          );
          this.connectedCallback();
        }

        connectedCallback() {
          if (!this.product) return;
          this.innerHTML = `
            <h2>${this.product.title}</h2>
            <div>
              <p>${this.product.description || "-"}</p>
              <div>
                <img src="${this.image}" alt="">
              </div>
              <button>Tilføj</button>
            </div>
          `;
        }

        static observedAttributes = ["product", "image"];

        attributeChangedCallback(attrName, oldVal, newVal) {
          if (attrName === "product") {
            this.product = JSON.parse(unescape(newVal));
          }
          if (attrName === "image") {
            this.image = newVal;
          }
        }
      }
    );
  }
})();
