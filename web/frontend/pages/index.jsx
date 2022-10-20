import { TitleBar } from "@shopify/app-bridge-react";
import { Card, Page, Tabs } from "@shopify/polaris";
import { useCallback, useState } from "react";
import Calendar from "../components/tabs/Calendar";
import Collections from "../components/tabs/Collections";
import Staff from "../components/tabs/Staff";

export default () => {
  const [selected, setSelected] = useState(0);

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
      id: "collections",
      content: "Collections",
      panelID: "collections",
      component: <Collections></Collections>,
    },
    {
      id: "staff",
      content: "Staff",
      panelID: "staff",
      component: <Staff></Staff>,
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
