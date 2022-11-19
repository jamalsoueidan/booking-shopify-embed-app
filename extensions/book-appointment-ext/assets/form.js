function getTime(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const value = `${startDate.getHours()}:${
    startDate.getMinutes() < 10 ? "0" : ""
  }${startDate.getMinutes()} - ${endDate.getHours()}:${
    endDate.getMinutes() < 10 ? "0" : ""
  }${endDate.getMinutes()}`;
  return value;
}

const EVENT_NAME = "cart-added";

function intercept() {
  const { fetch: originalFetch } = window;

  window.fetch = async (...args) => {
    let [resource, config] = args;
    const response = await originalFetch(resource, config);
    if (resource === "/cart/add") {
      const myEvent = new CustomEvent(EVENT_NAME, {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
      });
      document.querySelector("body").dispatchEvent(myEvent);
    }
    return response;
  };
}

window.addEventListener("load", function () {
  const tagName = "product-availability";
  const url = "https://a441fc679029.eu.ngrok.io";

  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends HTMLElement {
        dataset = null;
        dateInput = null;
        staffSelect = null;
        timeSelect = null;
        endHourInput = null;
        template = null;
        schedules = null;
        staff = null; //staff data
        submitButton = null;
        data = {};

        constructor() {
          super();
          this.template = document.getElementById("product-availability");
          this.dataset = this.template.dataset;

          fetch(
            `${url}/api/widget/staff?shop=${this.dataset.shop}&productId=${this.dataset.productId}`
          ).then(this.onStaffFetch.bind(this));

          document
            .querySelector("body")
            .addEventListener(EVENT_NAME, this.reset.bind(this));

          this.submitButton = document.querySelector("button[type=submit]");
        }

        addTemplate() {
          this.appendChild(this.template.content.cloneNode(true));
          this.staffSelect = this.querySelector("#staffSelect");
          this.staffSelect.addEventListener(
            "change",
            this.onStaffSelect.bind(this)
          );

          this.timeSelect = document.querySelector("#timeSelect");
          this.timeSelect.addEventListener(
            "change",
            this.onHourSelect.bind(this)
          );

          this.updateData({
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }

        updateData(newData) {
          this.data = {
            ...this.data,
            ...newData,
          };
        }

        reset() {
          fetch(
            `${url}/api/widget/cart?shop=${this.dataset.shop}&productId=${this.dataset.productId}`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...this.data,
                staffId: this.data.staff.staff,
              }),
            }
          );
          this.resetDate();
          this.staffSelect.options.selectedIndex = 0;
          this.querySelector("#dateInput").disabled = true;
        }

        resetDate() {
          this.dateInput && this.dateInput.clear();
          this.resetHourSelect();
        }

        resetHourSelect() {
          this.timeSelect.innerHTML = "";
          var opt = document.createElement("option");
          opt.value = "null";
          opt.innerHTML = "Vælge tid";
          this.timeSelect.appendChild(opt);
          this.timeSelect.disabled = true;
          this.submitButton.disabled = true;
        }

        async onStaffFetch(response) {
          const { payload } = await response.json();
          this.staff = payload;
          if (payload.length === 0) return;

          this.submitButton.disabled = true;
          this.addTemplate();
          intercept();

          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = element.fullname;
            opt.innerHTML = element.fullname;
            this.staffSelect.appendChild(opt);
          });
        }

        onHourSelect() {
          const time = this.timeSelect.value;
          const schedule = this.schedules.find(
            (s) => s.date === time.substring(0, 10)
          );
          const hour = schedule.hours.find((h) => h.start === time);
          const anyAvailable = this.staffSelect.value !== hour.staff.fullname;

          this.updateData({
            ...hour,
            staff: {
              staff: hour.staff._id,
              fullname: hour.staff.fullname,
              anyStaff: anyAvailable,
            },
          });

          document.getElementById("staff").value = anyAvailable
            ? this.staffSelect.value
            : hour.staff.fullname;
          document.getElementById("time").value = getTime(hour.start, hour.end);
          document.getElementById("data").value = JSON.stringify(this.data);
          this.submitButton.disabled = false;
        }

        onStaffSelect() {
          this.resetDate();
          const value = this.staffSelect.value;
          const index = this.staffSelect.options.selectedIndex;
          if (index === 0) {
            return this.reset();
          }

          const staffId = this.staff.find((s) => s.fullname === value);
          const path = new URL(`${url}/api/widget/availability-range`);
          const params = new URLSearchParams(url.search);
          params.append("shop", this.dataset.shop);
          params.append("productId", this.dataset.productId);
          if (staffId) {
            params.append("staffId", staffId.staff);
          }

          const DateTime = easepick.DateTime;
          const currentDate = new DateTime();
          const endOfMonth = new DateTime(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          );

          params.append("start", currentDate.format("YYYY-MM-DD"));
          params.append("end", endOfMonth.format("YYYY-MM-DD"));

          fetch(path + "?" + params.toString()).then(
            this.onAvailabilityFetch.bind(this)
          );
        }

        async onAvailabilityFetch(response) {
          const { payload } = await response.json();
          this.schedules = payload;
          //date string format YYYY-MM-DD
          const findSchedule = (date) =>
            payload.find(
              (schedule) => schedule.date === date && schedule.hours.length > 0
            );

          const self = this;

          if (this.dateInput) {
            this.dateInput.destroy();
          }

          this.dateInput = new easepick.create({
            element: this.querySelector("#dateInput"),
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
              picker.on("render", (evt) => {
                self.querySelector("#dateInput").disabled = false;
              });

              picker.on("view", (evt) => {
                const { view, date, target } = evt.detail;
                const d = date ? date.format("YYYY-MM-DD") : null;

                const schedule = findSchedule(d);

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
                self.resetHourSelect();
                self.timeSelect.disabled = false;
                if (schedule) {
                  //remove duplication
                  schedule.hours = schedule.hours.reduce((hours, current) => {
                    const notFound = !hours.find(
                      (h) => h.start === current.start && h.end === current.end
                    );
                    if (notFound) {
                      hours.push(current);
                    }
                    return hours;
                  }, []);

                  schedule.hours.forEach((element) => {
                    var opt = document.createElement("option");
                    opt.value = element.start;
                    opt.innerHTML = getTime(element.start, element.end);
                    self.timeSelect.appendChild(opt);
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
