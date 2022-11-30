import AppContext from "./AppContext";
import { SelectDate } from "./components/SelectDate";
import { SelectStaff } from "./components/SelectStaff";
import { SelectTime } from "./components/SelectTime";

function App({ config }: AppProps) {
  return (
    <AppContext.Provider value={config}>
      <input id="staff" name="properties[staff]" hidden />

      <div className="customer">
        <SelectStaff></SelectStaff>
        <SelectDate></SelectDate>
        <SelectTime></SelectTime>
      </div>
      <input id="time" name="properties[time]" hidden />
      <input id="data" name="properties[_data]" hidden />
    </AppContext.Provider>
  );
}

export default App;
