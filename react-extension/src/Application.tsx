import { DateTime } from "@easepick/bundle";
import styled from "@emotion/styled";
import { useField, useForm } from "@shopify/react-form";
import { useCallback, useEffect } from "react";
import { useSWRConfig } from "swr";
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
  const { mutate, cache } = useSWRConfig();

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

  const clearCache = useCallback(() => {
    (cache as any).forEach((_: any, key: string) => {
      if (key.indexOf("availability-range") !== -1) {
        mutate(key);
      }
    });
  }, [cache, mutate]);

  useEffect(() => {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      const response = await originalFetch(resource, config);
      if (resource === "/cart/add") {
        clearCache();
        reset();
      }
      return response;
    };
  }, [reset, clearCache]);

  return (
    <AppContext.Provider value={config}>
      <FormContext.Provider
        value={{
          staff: fields.staff.value,
          schedule: fields.schedule.value,
          hour: fields.hour.value,
        }}
      >
        <Bootup fields={fields}>
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
              id="timezone"
              name="properties[Tidszone]"
              defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
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
