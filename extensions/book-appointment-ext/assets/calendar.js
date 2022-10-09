(function () {
  const tagName = "wizard-calendar";
  if (!customElements.get(tagName)) {
    //https://web.dev/custom-elements-v1/
    customElements.define(
      tagName,
      class extends HTMLElement {
        constructor() {
          super();
        }

        connectedCallback() {
          this.innerHTML = `
            <div class="date">
              <div id="vanilla-calendar"></div>
            </div>
            <div class="time">
              <div class="column">
                <p>Morning</p>
                <ul>
                  <li><button>03:00</button></li>
                  <li><button>03:00</button></li>
                </ul>
              </div>
              <div class="column">
                <p>Afternoon</p>
                <ul>
                  <li><button>03:00</button></li>
                  <li><button>03:00</button></li>
                </ul>
              </div>
              <div class="column">
                <p>Evening</p>
                <ul>
                  <li><button>03:00</button></li>
                  <li><button>03:00</button></li>
                </ul>
              </div>
            </div>
          `;
          this.init();
        }

        init() {
          const dispatchEvent = this.dispatchEvent.bind(this);
          const calendar = new VanillaCalendar(
            this.querySelector("#vanilla-calendar"),
            {
              settings: {
                lang: "da",
              },
              actions: {
                clickDay(e, dates) {
                  dispatchEvent(
                    new CustomEvent("calendar", {
                      bubbles: true,
                      composed: true,
                      detail: {
                        payload: dates,
                      },
                    })
                  );
                },
              },
            }
          );
          calendar.init();
        }
      }
    );
  }
})();
