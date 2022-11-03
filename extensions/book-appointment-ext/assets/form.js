window.addEventListener("load", function () {
  const tagName = "product-availability";
  const url = "https://b7c43feb7525.in.ngrok.io";

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
          this.staffSelect = this.querySelector("#Staff");
          this.staffSelect.addEventListener(
            "change",
            this.onStaffSelect.bind(this)
          );

          this.hourSelect = document.querySelector("#Hour");
        }

        async onStaffFetch(response) {
          const { payload } = await response.json();
          if (payload.length > 0) {
            this.addTemplate();
          }

          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = JSON.stringify({
              staff: element.staff,
              fullname: element.fullname,
            });
            opt.innerHTML = element.fullname;
            this.staffSelect.appendChild(opt);
          });
        }

        onStaffSelect() {
          const value = JSON.parse(this.staffSelect.value);
          if (value === "") return;
          const staffId = value !== "0" ? value.staff : null;
          const path = new URL(
            `${url}/api/widget/availability/${staffId ? "range" : "any"}`
          );
          const params = new URLSearchParams(url.search);
          params.append("shop", this.dataset.shop);
          params.append("productId", this.dataset.productId);
          if (staffId) {
            params.append("staffId", staffId);
          }

          const DateTime = easepick.DateTime;
          const currentDate = new DateTime();
          const endOfMonth = new DateTime(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          );

          params.append("start", currentDate.format("YYYY-MM-DD"));
          params.append("end", endOfMonth.format("YYYY-MM-DD"));
          fetch(path + "?" + params.toString())
            .then(this.onAvailabilityFetch.bind(this))
            .finally(() => {
              this.hourSelect.disabled = false;
            });
        }

        onChange() {}

        async onAvailabilityFetch(response) {
          const { payload } = await response.json();

          //date string format YYYY-MM-DD
          const findSchedule = (date) =>
            payload.find(
              (schedule) => schedule.date === date && schedule.hours.length > 0
            );

          const self = this;

          this.querySelector("#datepicker").disabled = false;
          if (this.dateInput) {
            console.log("destroy");
            this.dateInput.destroy();
          }

          this.dateInput = new easepick.create({
            element: this.querySelector("#datepicker"),
            css: [
              "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css",
              "https://easepick.com/css/demo_prices.css",
            ],
            zIndex: 10,
            plugins: ["LockPlugin"],
            LockPlugin: {
              filter(date, picked) {
                return !findSchedule(date.format("YYYY-MM-DD"));
              },
            },
            setup(picker) {
              picker.on("view", (evt) => {
                const { view, date, target } = evt.detail;
                const d = date ? date.format("YYYY-MM-DD") : null;

                const schedule = payload.find(
                  (schedule) => schedule.date === d && schedule.hours.length > 0
                );

                if (view === "CalendarDay" && schedule) {
                  const span =
                    target.querySelector(".day-price") ||
                    document.createElement("span");
                  span.className = "day-price";
                  span.innerHTML = `${schedule.hours.length}`;
                  target.append(span);
                }
              });

              picker.on("select", (e) => {
                const { date } = e.detail;
                const schedule = findSchedule(date.format("YYYY-MM-DD"));

                self.hourSelect.innerHTML = "";
                if (schedule) {
                  schedule.hours.forEach((element) => {
                    var opt = document.createElement("option");
                    const date = new Date(element.start);
                    const value =
                      date.getHours() +
                      ":" +
                      (date.getMinutes() < 10 ? "0" : "") +
                      date.getMinutes();
                    opt.value = date.toISOString();
                    opt.innerHTML = value;
                    self.hourSelect.appendChild(opt);
                  });
                }
              });
            },
          });
        }
      }
    );

    const div = document.querySelector(".product-form__buttons");
    div.innerHTML =
      "<product-availability></product-availability>" + div.innerHTML;
  }
});
