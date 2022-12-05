import { DateTime, easepick, LockPlugin } from "@easepick/bundle";
import styled from "@emotion/styled";
import {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FormContext from "../contexts/FormContext";
import { useDate } from "../hooks/useDate";

const SVG = styled.svg`
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  position: absolute;
  right: 12px;
  top: 15px;
`;

const Input = styled.input`
  &:not(:placeholder-shown) {
    padding: 1.5rem !important;
  }
`;

interface SelectDateProps extends FieldProps {}

export const SelectDate = ({ fields }: SelectDateProps) => {
  const { staff } = useContext(FormContext);
  const [date, setDate] = useState(new DateTime());

  const dateInput = createRef<HTMLInputElement>();
  const datePicker = useRef<easepick.Core>();
  const { data: events } = useDate({ date });

  const findSchedule = useCallback(
    (date: string) =>
      events?.find(
        (schedule) => schedule.date === date && schedule.hours.length > 0
      ),
    [events]
  );

  const filter = useCallback(
    (date: DateTime | DateTime[], picked: DateTime[]) => {
      if (!Array.isArray(date)) {
        return !findSchedule(date.format("YYYY-MM-DD"));
      }
      return false;
    },
    [findSchedule]
  );

  const select = useCallback(
    ({ detail }: any) => {
      const { date } = detail;
      fields.schedule.onChange(findSchedule(date.format("YYYY-MM-DD")));
    },
    [findSchedule, fields]
  );

  const view = useCallback(
    (e: any) => {
      const { view, date, target } = e.detail;
      if (view === "CalendarHeader") {
        target.querySelector(".previous-button").style.display =
          date.getMonth() < new Date().getMonth() ? "block" : "none";
        setDate(date);
        return;
      }

      const d = date ? date.format("YYYY-MM-DD") : null;
      if (view === "CalendarDay" && d) {
        const schedule = findSchedule(d);
        if (schedule) {
          const span =
            target.querySelector(".day-price") ||
            document.createElement("span");
          span.className = "day-price";
          span.innerHTML = `${schedule.hours.length}`;
          target.append(span);
        }
      }
    },
    [findSchedule]
  );

  useEffect(() => {
    if (dateInput.current && !datePicker.current) {
      datePicker.current = new easepick.create({
        element: dateInput.current,
        css: [
          "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css",
          "https://easepick.com/css/demo_prices.css",
        ],
        lang: "da-DK",
        zIndex: 10,
        plugins: [LockPlugin],
      });
    }
  }, [dateInput, datePicker]);

  useEffect(() => {
    const picker = datePicker.current;
    if (picker) {
      const lockPlugin =
        picker.PluginManager.getInstance<LockPlugin>("LockPlugin");

      lockPlugin.options.filter = filter;
      lockPlugin.options.minDate = new Date();
      picker.on("select", select);
      picker.on("view", view);
      picker.renderAll();
    }
    return () => {
      const picker = datePicker.current;
      if (picker) {
        picker.off("select", select);
        picker.off("view", view);
      }
    };
  }, [datePicker, filter, events, select, view]);

  useEffect(() => {
    if (!fields.schedule.value && datePicker.current) {
      datePicker.current.clear();
      datePicker.current.renderAll();
    }
  }, [datePicker, fields]);

  return (
    <div>
      <label className="form__label" htmlFor="dateInput">
        {" "}
        2. Vælg dato:{" "}
      </label>
      <div className="field">
        <Input
          ref={dateInput}
          className="input"
          required
          disabled={!staff}
          placeholder=""
        />
        <SVG
          aria-hidden="true"
          focusable="false"
          role="presentation"
          className="icon icon-caret date"
          viewBox="0 0 1024 1024"
          version="1.1"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M716.066 584.985c33.755 0 61.117-27.363 61.117-61.115s-27.362-61.12-61.117-61.12c-33.752 0-61.117 27.367-61.117 61.12s27.364 61.115 61.117 61.115z m0-81.487c11.251 0 20.372 9.12 20.372 20.372 0 11.249-9.12 20.372-20.372 20.372-11.25 0-20.372-9.123-20.372-20.372 0-11.252 9.122-20.372 20.372-20.372zM308.62 584.985c33.754 0 61.117-27.363 61.117-61.115s-27.363-61.12-61.117-61.12c-33.755 0-61.115 27.367-61.115 61.12s27.36 61.115 61.115 61.115z m0-81.487c11.25 0 20.372 9.12 20.372 20.372 0 11.249-9.121 20.372-20.372 20.372-11.25 0-20.373-9.123-20.373-20.372 0-11.252 9.124-20.372 20.373-20.372z m203.722 305.584c33.755 0 61.117-27.367 61.117-61.12s-27.362-61.114-61.117-61.114c-33.752 0-61.116 27.362-61.116 61.115s27.364 61.119 61.116 61.119z m0-81.49c11.254 0 20.373 9.122 20.373 20.37 0 11.252-9.12 20.373-20.373 20.373-11.25 0-20.372-9.121-20.372-20.372 0-11.25 9.123-20.37 20.372-20.37z m203.724 81.49c33.755 0 61.117-27.367 61.117-61.12s-27.362-61.114-61.117-61.114c-33.752 0-61.117 27.362-61.117 61.115s27.364 61.119 61.117 61.119z m0-81.49c11.251 0 20.372 9.122 20.372 20.37 0 11.252-9.12 20.373-20.372 20.373-11.25 0-20.372-9.121-20.372-20.372 0-11.25 9.122-20.37 20.372-20.37z m162.98-631.54H777.183v-0.003c0-33.752-27.362-61.117-61.117-61.117-33.752 0-61.117 27.365-61.117 61.117v0.002H573.46v-0.002c0-33.752-27.362-61.117-61.117-61.117-33.752 0-61.116 27.365-61.116 61.117v0.002h-81.49v-0.002c0-33.752-27.362-61.117-61.116-61.117-33.755 0-61.115 27.365-61.115 61.117v0.002H145.645c-45.005 0-81.491 36.484-81.491 81.49v733.4c0 45.007 36.486 81.491 81.49 81.491h733.403c45.005 0 81.487-36.484 81.487-81.491v-733.4c0-45.004-36.484-81.49-81.488-81.49z m-183.352-0.003c0-11.251 9.123-20.372 20.372-20.372 11.251 0 20.372 9.12 20.372 20.372v40.747c0 11.249-9.12 20.37-20.372 20.37-11.25 0-20.372-9.121-20.372-20.37V96.049z m-203.724 0c0-11.251 9.123-20.372 20.372-20.372 11.254 0 20.373 9.12 20.373 20.372v40.747c0 11.249-9.12 20.37-20.373 20.37-11.25 0-20.372-9.121-20.372-20.37V96.049z m-203.723 0c0-11.251 9.124-20.372 20.373-20.372 11.25 0 20.372 9.12 20.372 20.372v40.747c0 11.249-9.121 20.37-20.372 20.37-11.25 0-20.373-9.121-20.373-20.37V96.049zM919.79 910.941c0 22.503-18.241 40.749-40.743 40.749H145.644c-22.506 0-40.745-18.246-40.745-40.75V320.145h814.89v590.797z m0-631.54h-814.89v-101.86c0-22.504 18.24-40.743 40.745-40.743h101.861c0.001 33.751 27.361 61.115 61.115 61.115 33.754 0 61.115-27.364 61.117-61.115h81.489c0 33.751 27.364 61.115 61.116 61.115 33.755 0 61.116-27.364 61.117-61.115h81.49c0 33.751 27.364 61.115 61.116 61.115 33.755 0 61.116-27.364 61.117-61.115h101.863c22.502 0 40.743 18.239 40.743 40.742v101.862zM512.342 584.986c33.755 0 61.117-27.363 61.117-61.115s-27.362-61.12-61.117-61.12c-33.752 0-61.116 27.367-61.116 61.12s27.364 61.115 61.116 61.115z m0-81.487c11.254 0 20.373 9.12 20.373 20.372 0 11.249-9.12 20.372-20.373 20.372-11.25 0-20.372-9.123-20.372-20.372 0-11.252 9.123-20.372 20.372-20.372zM308.62 809.082c33.754 0 61.117-27.367 61.117-61.12s-27.363-61.114-61.117-61.114c-33.755 0-61.115 27.362-61.115 61.115s27.36 61.119 61.115 61.119z m0-81.49c11.25 0 20.372 9.122 20.372 20.37 0 11.252-9.121 20.373-20.372 20.373-11.25 0-20.373-9.121-20.373-20.372 0-11.25 9.124-20.37 20.373-20.37z"
            fill=""
          />
        </SVG>
      </div>
    </div>
  );
};
