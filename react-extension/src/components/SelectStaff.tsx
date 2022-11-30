import styled from "@emotion/styled";
import { useStaff } from "../hooks/useStaff";

const SVG = styled.svg`
  height: 0.6rem;
`;

export const SelectStaff = () => {
  const { data } = useStaff();
  console.log(data);
  return (
    <div className="mb">
      <label className="form__label" htmlFor="staffSelect">
        {" "}
        1. Vælg frisør:{" "}
      </label>
      <div className="select">
        <select id="staffSelect" required>
          <option value="" selected>
            Vælg frisør
          </option>
          <option value="Enhver tilgængelig">Enhver tilgængelig</option>
        </select>
        <SVG
          aria-hidden="true"
          focusable="false"
          role="presentation"
          className="icon icon-caret"
          viewBox="0 0 10 6"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
            fill="currentColor"
          ></path>
        </SVG>
      </div>
    </div>
  );
};
