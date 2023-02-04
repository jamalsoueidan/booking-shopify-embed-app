import { SettingsApplication } from "@components/settings/settings-application";
import { SettingsNotifications } from "@components/settings/settings-notifications";
import { ActionList, Card, Grid, Page } from "@shopify/polaris";
import { NotificationMajor, SettingsMajor } from "@shopify/polaris-icons";
import { useState } from "react";

export default () => {
  const [current, setCurrent] = useState<string>("application");

  let Component;
  if (current === "application") {
    Component = SettingsApplication;
  } else {
    Component = SettingsNotifications;
  }

  return (
    <Page fullWidth>
      <Grid>
        <Grid.Cell columnSpan={{ lg: 2, md: 2, sm: 6, xl: 2, xs: 6 }}>
          <Card>
            <ActionList
              actionRole="menuitem"
              sections={[
                {
                  items: [
                    {
                      active: current === "application",
                      content: "Application",
                      icon: SettingsMajor,
                      onAction: () => {
                        setCurrent("application");
                      },
                    },
                    {
                      active: current === "notifications",
                      content: "Notifications",
                      icon: NotificationMajor,
                      onAction: () => {
                        setCurrent("notifications");
                      },
                    },
                  ],
                  title: "Settings",
                },
              ]}
            />
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ lg: 10, md: 4, sm: 6, xl: 10, xs: 6 }}>
          <Component />
        </Grid.Cell>
      </Grid>
    </Page>
  );
};
