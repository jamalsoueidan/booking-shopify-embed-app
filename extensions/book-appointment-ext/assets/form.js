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

window.addEventListener("load", function () {
  const tagName = "product-availability";
  const url = "https://f069e45b477c.eu.ngrok.io";

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
        data = {};

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

        resetHourSelect() {
          this.dateInput && this.dateInput.clear();
          this.timeSelect.innerHTML = "";
          var opt = document.createElement("option");
          opt.value = "null";
          opt.innerHTML = "Vælge tid";
          this.timeSelect.appendChild(opt);
          this.timeSelect.disabled = true;
        }

        onHourSelect() {
          const time = this.timeSelect.value;
          const schedule = this.schedules.find(
            (s) => s.date === time.substring(0, 10)
          );
          const hour = schedule.hours.find((h) => h.start === time);

          const anyAvailable = this.staffSelect.value.substring(0, 1) !== "{";
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
        }

        async onStaffFetch(response) {
          const { payload } = await response.json();
          if (payload.length > 0) {
            this.addTemplate();
          }

          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = element.fullname;
            opt.innerHTML = element.fullname;
            this.staffSelect.appendChild(opt);
          });
        }

        onStaffSelect() {
          this.resetHourSelect();
          const value = this.staffSelect.value;
          const staffId =
            value.substring(0, 1) === "{" ? JSON.parse(value).staff : null;
          const path = new URL(`${url}/api/widget/availability-range`);
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
