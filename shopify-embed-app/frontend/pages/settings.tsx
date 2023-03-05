import { SettingsApplication } from "@components/settings/settings-application";
import { SettingsNotifications } from "@components/settings/settings-notifications";
import { useTranslation } from "@jamalsoueidan/pkg.frontend";
import { ActionList, Card, Grid, Page } from "@shopify/polaris";
import { NotificationMajor, SettingsMajor } from "@shopify/polaris-icons";
import { useState } from "react";

export default () => {
  const { t } = useTranslation({ id: "settings", locales });
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
                      content: t("application"),
                      icon: SettingsMajor,
                      onAction: () => {
                        setCurrent("application");
                      },
                    },
                    {
                      active: current === "notifications",
                      content: t("notifications"),
                      icon: NotificationMajor,
                      onAction: () => {
                        setCurrent("notifications");
                      },
                    },
                  ],
                  title: t("settings"),
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

const locales = {
  da: {
    settings: "Indstillinger",
    application: "Applikation",
    notifications: "Meddelser",
  },
  en: {
    settings: "Settings",
    application: "Application",
    notifications: "Notifications",
  },
};
