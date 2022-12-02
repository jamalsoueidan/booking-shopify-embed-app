import { DateTime } from "@easepick/bundle";
import styled from "@emotion/styled";
import { useField, useForm } from "@shopify/react-form";
import { useEffect, useState } from "react";
import { Bootup } from "./Bootup";
import { SelectDate } from "./components/SelectDate";
import { SelectHour } from "./components/SelectHour";
import { SelectStaff } from "./components/SelectStaff";
import AppContext from "./contexts/AppContext";
import FormContext from "./contexts/FormContext";
import { getTime } from "./libs/getTime";

const ApplicationStyled = styled("div")`
  .customer div {
    margin-bottom: 15px;
  }

  input:disabled,
  select:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    background: #ebebeb !important;
  }
`;

function App({ config }: AppProps) {
  const [submit, setSubmit] = useState<HTMLButtonElement>();

  const { fields, reset } = useForm({
    fields: {
      staff: useField<Staff | undefined>({
        value: undefined,
        validates: [],
      }),
      schedule: useField<Schedule | undefined>({
        value: undefined,
        validates: [],
      }),
      hour: useField<Hour | undefined>({
        value: undefined,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues: any) => {
      return { status: "fail", errors: [{ message: "bad form data" }] };
    },
  });

  // on first render, assign submit
  useEffect(() => {
    const submit = document.querySelector<HTMLButtonElement>(
      "button[type=submit]"
    );
    if (submit) {
      setSubmit(submit);
      submit.disabled = true;
    }
  }, []);

  useEffect(() => {
    const { fetch: originalFetch } = window;
    console.log("reset");
    window.fetch = async (...args) => {
      let [resource, config] = args;
      const response = await originalFetch(resource, config);
      if (resource === "/cart/add") {
        reset();
      }
      return response;
    };
  }, [reset]);

  useEffect(() => {
    if (!submit) return;

    if (fields.staff.value && fields.hour.value && fields.schedule.value) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }
  }, [submit, fields]);

  return (
    <AppContext.Provider value={config}>
      <FormContext.Provider
        value={{
          staff: fields.staff.value,
          schedule: fields.schedule.value,
          hour: fields.hour.value,
        }}
      >
        <Bootup>
          <ApplicationStyled>
            <div className="customer">
              <SelectStaff fields={fields}></SelectStaff>
              <SelectDate fields={fields}></SelectDate>
              <SelectHour fields={fields}></SelectHour>
            </div>
            <input
              id="staff"
              name="properties[Medarbejder]"
              defaultValue={
                fields.staff.value?.anyAvailable
                  ? "Enhver tilgængelig"
                  : fields.staff.value?.fullname
              }
              hidden
            />
            <input
              id="date"
              name="properties[Dato]"
              defaultValue={
                fields.schedule.value
                  ? new DateTime(new Date(fields.schedule.value?.date)).format(
                      "DD. MMM YYYY",
                      "da"
                    )
                  : ""
              }
              hidden
            />
            <input
              id="time"
              name="properties[Tid]"
              defaultValue={fields.hour.value && getTime(fields.hour.value)}
              hidden
            />
            <input
              id="data"
              name="properties[_data]"
              value={JSON.stringify({
                ...fields.hour.value,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })}
              hidden
            />
          </ApplicationStyled>
        </Bootup>
      </FormContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
