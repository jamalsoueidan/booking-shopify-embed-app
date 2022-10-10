import { TitleBar } from "@shopify/app-bridge-react";
import { Card, Page, Tabs } from "@shopify/polaris";
import { useCallback, useState } from "react";
import Calendar from "../components/tabs/Calendar";
import Collections from "../components/tabs/Collections";

export default () => {
  const [selected, setSelected] = useState(1);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "calendar",
      content: "Calendar",
      panelID: "calendar",
      component: <Calendar></Calendar>,
    },
    {
      id: "treatments",
      content: "Treatments",
      panelID: "treatments",
      component: <Collections></Collections>,
    },
  ];

  return (
    <>
      <div style={{ backgroundColor: "#fff" }}>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      </div>
      <Page>{tabs[selected].component}</Page>
    </>
  );
};
