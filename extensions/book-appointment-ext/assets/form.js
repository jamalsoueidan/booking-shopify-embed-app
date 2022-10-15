(function () {
  const tagName = "product-availability";
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends HTMLElement {
        dateInput = null;
        staffSelect = null;
        hourSelect = null;

        constructor() {
          super();
          let template = document.getElementById("product-availability");
          this.appendChild(template.content.cloneNode(true));

          this.dateInput = this.querySelector("#date");
          this.dateInput.addEventListener("change", this.onChange.bind(this));

          this.staffSelect = this.querySelector("#Staff");
          this.staffSelect.addEventListener("change", this.onChange.bind(this));

          this.hourSelect = document.querySelector("#Hour");

          fetch("http://localhost:56140/api/web/widget/staff").then(
            this.onStaffFetch.bind(this)
          );
        }

        onChange() {
          if (this.dateInput.value !== "" && this.staffSelect.value !== "") {
            fetch(
              `http://localhost:56140/api/web/widget/availability?shop=yguuy&date=${this.dateInput.value}&user_id=${this.staffSelect.value}`
            ).then(this.onAvailabilityFetch.bind(this));
          }
        }

        async onAvailabilityFetch(response) {
          const { payload } = await response.json();
          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = element.start_time;
            opt.innerHTML = element.start_time;
            this.hourSelect.appendChild(opt);
          });
        }

        async onStaffFetch(response) {
          const { payload } = await response.json();
          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = element.id;
            opt.innerHTML = element.fullname;
            this.staffSelect.appendChild(opt);
          });
        }
      }
    );

    const div = document.querySelector(".product-form__buttons");
    div.innerHTML =
      "<product-availability></product-availability>" + div.innerHTML;
  }
})();
