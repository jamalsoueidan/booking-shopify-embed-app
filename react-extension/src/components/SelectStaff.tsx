import styled from "@emotion/styled";
import { ChangeEvent, useCallback } from "react";
import { useStaff } from "../hooks/useStaff";

const SVG = styled.svg`
  height: 0.6rem;
`;

interface SelectStaffProps {
  onChange: (value: Staff | undefined) => void;
}

export const SelectStaff = ({ onChange }: SelectStaffProps) => {
  const { data } = useStaff();

  const selectOnChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedIndex = event.target.selectedIndex;
      if (selectedIndex === 0) {
        return onChange(undefined);
      }
      if (selectedIndex === 1) {
        return onChange({ _id: "", fullname: "", staff: "", tag: "" });
      }

      onChange(data[selectedIndex - 2]);
    },
    [onChange, data]
  );

  return (
    <div>
      <label className="form__label" htmlFor="staffSelect">
        {" "}
        1. Vælg frisør:{" "}
      </label>
      <div className="select">
        <select id="staffSelect" onChange={selectOnChange} required>
          <option value="">Vælg frisør</option>
          <option value="Enhver tilgængelig">Enhver tilgængelig</option>
          {data?.map((option, index) => {
            return <option key={option.staff}>{option.fullname}</option>;
          })}
        </select>
        <SVG
          aria-hidden="true"
          focusable="false"
          role="presentation"
          className="icon icon-caret"
          viewBox="0 0 10 6"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
            fill="currentColor"
          ></path>
        </SVG>
      </div>
    </div>
  );
};
