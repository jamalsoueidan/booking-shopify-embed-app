import styled from "@emotion/styled";
import { useState } from "react";
import { Bootup } from "./Bootup";
import { SelectDate } from "./components/SelectDate";
import { SelectStaff } from "./components/SelectStaff";
import { SelectTime } from "./components/SelectTime";
import AppContext from "./contexts/AppContext";
import FormContext from "./contexts/FormContext";

const ApplicationStyled = styled("div")`
  .customer div {
    margin-bottom: 15px;
  }
`;

function App({ config }: AppProps) {
  const [staff, setStaff] = useState<Staff | undefined>();
  const [schedule, setSchedule] = useState<Schedule | undefined>();

  return (
    <AppContext.Provider value={config}>
      <FormContext.Provider value={{ staff, schedule }}>
        <Bootup>
          <ApplicationStyled>
            <input id="staff" name="properties[staff]" hidden />

            <div className="customer">
              <SelectStaff onChange={setStaff}></SelectStaff>
              <SelectDate onChange={setSchedule}></SelectDate>
              <SelectTime></SelectTime>
            </div>
            <input id="time" name="properties[time]" hidden />
            <input id="data" name="properties[_data]" hidden />
          </ApplicationStyled>
        </Bootup>
      </FormContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
