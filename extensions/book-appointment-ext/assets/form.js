(function () {
  const tagName = "product-availability";
  const url = "http://localhost:49337";

  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends HTMLElement {
        dataset = null;
        dateInput = null;
        staffSelect = null;
        hourSelect = null;
        template = null;

        constructor() {
          super();
          this.template = document.getElementById("product-availability");
          this.dataset = this.template.dataset;

          fetch(
            `${url}/api/widget/staff?shop=${this.dataset.shop}&productId=${this.dataset.productId}`
          ).then(this.onStaffFetch.bind(this));
        }

        addTemplate() {
          this.appendChild(this.template.content.cloneNode(true));
          this.dateInput = this.querySelector("#date");
          this.dateInput.addEventListener("change", this.onChange.bind(this));

          this.staffSelect = this.querySelector("#Staff");
          this.staffSelect.addEventListener("change", this.onChange.bind(this));

          this.hourSelect = document.querySelector("#Hour");
        }

        async onStaffFetch(response) {
          const { payload } = await response.json();
          if (payload.length > 0) {
            this.addTemplate();
          }

          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = element.staff;
            opt.innerHTML = element.fullname;
            this.staffSelect.appendChild(opt);
          });
        }

        onChange() {
          if (this.dateInput.value !== "" && this.staffSelect.value !== "") {
            fetch(
              `${url}/api/widget/availability?shop=${this.dataset.shop}&date=${this.dateInput.value}&staffId=${this.staffSelect.value}&productId=${this.dataset.productId}`
            )
              .then(this.onAvailabilityFetch.bind(this))
              .finally(() => {
                this.hourSelect.disabled = false;
              });
          }
        }

        async onAvailabilityFetch(response) {
          this.hourSelect.length = 0;
          const { payload } = await response.json();
          payload.forEach((element) => {
            var opt = document.createElement("option");
            const date = new Date(element);
            const value =
              date.getHours() +
              ":" +
              (date.getMinutes() < 10 ? "0" : "") +
              date.getMinutes();
            opt.value = date.toISOString();
            opt.innerHTML = value;
            this.hourSelect.appendChild(opt);
          });
        }
      }
    );

    const div = document.querySelector(".product-form__buttons");
    div.innerHTML =
      "<product-availability></product-availability>" + div.innerHTML;
  }
})();
