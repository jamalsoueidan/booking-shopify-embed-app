import styled from "@emotion/styled";
import { useCallback, useContext, useEffect, useState } from "react";
import FormContext from "../contexts/FormContext";

const SVG = styled.svg`
  position: absolute;
  width: 1em !important;
  height: 1em !important;
  vertical-align: middle;
  fill: currentcolor;
  overflow: hidden;
  right: 15px !important;
  top: 15px !important;
`;

export const SelectTime = () => {
  const { schedule } = useContext(FormContext);
  const [hours, setHours] = useState<Array<Hour>>([]);

  useEffect(() => {
    if (schedule) {
      const hours: Hour[] = schedule.hours.reduce((hours: Hour[], current) => {
        const notFound = !hours.find(
          (h) => h.start === current.start && h.end === current.end
        );
        if (notFound) {
          hours.push(current);
        }
        return hours;
      }, []);

      setHours(hours);
    }
  }, [schedule]);

  const getTime = useCallback(
    ({ start, end }: { start: string; end: string }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const value = `${startDate.getHours()}:${
        startDate.getMinutes() < 10 ? "0" : ""
      }${startDate.getMinutes()} - ${endDate.getHours()}:${
        endDate.getMinutes() < 10 ? "0" : ""
      }${endDate.getMinutes()}`;
      return value;
    },
    []
  );

  return (
    <div>
      <label className="form__label" htmlFor="timeSelect">
        {" "}
        3. Vælg tid:{" "}
      </label>
      <div className="select">
        <select
          id="timeSelect"
          className="select"
          required
          disabled={!schedule}
        >
          <option value="" disabled selected>
            Vælg tid
          </option>
          {hours?.map((option) => {
            return <option key={option.start}>{getTime(option)}</option>;
          })}
        </select>
        <SVG
          aria-hidden="true"
          focusable="false"
          role="presentation"
          className="icon icon-caret"
          viewBox="0 0 1024 1024"
          version="1.1"
        >
          <path d="M512 16C238.064 16 16 238.08 16 512c0 273.936 222.064 496 496 496 273.952 0 496-222.048 496-496C1008 238.08 785.952 16 512 16zM512 946.976C272.688 946.976 78 751.312 78 512 78 272.688 272.688 78 512 78S946 272.688 946 512C946 751.312 751.312 946.976 512 946.976zM543.008 499.424 543.008 202c0-17.12-13.872-31.008-31.008-31.008s-31.008 13.872-31.008 31.008L480.992 512c0 8.768 3.664 16.64 9.52 22.288 0.528 0.608 0.944 1.28 1.52 1.856l153.44 153.44c12.112 12.112 31.744 12.112 43.84 0s12.112-31.728 0-43.84L543.008 499.424z" />
        </SVG>
      </div>
    </div>
  );
};
