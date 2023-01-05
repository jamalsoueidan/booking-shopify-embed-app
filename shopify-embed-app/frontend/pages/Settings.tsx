import Application from '@components/settings/Application';
import Notifications from '@components/settings/Notifications';
import { ActionList, Card, Grid, Page } from '@shopify/polaris';
import { NotificationMajor, SettingsMajor } from '@shopify/polaris-icons';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState<string>('application');

  let Component;
  if (current === 'application') {
    Component = Application;
  } else {
    Component = Notifications;
  }

  return (
    <Page fullWidth>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
          <Card>
            <ActionList
              actionRole="menuitem"
              sections={[
                {
                  title: 'Settings',
                  items: [
                    {
                      active: current === 'application',
                      content: 'Application',
                      icon: SettingsMajor,
                      onAction: () => {
                        setCurrent('application');
                      },
                    },
                    {
                      active: current === 'notifications',
                      content: 'Notifications',
                      icon: NotificationMajor,
                      onAction: () => {
                        setCurrent('notifications');
                      },
                    },
                  ],
                },
              ]}
            />
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 10, xl: 10 }}>
          <Component />
        </Grid.Cell>
      </Grid>
    </Page>
  );
};
