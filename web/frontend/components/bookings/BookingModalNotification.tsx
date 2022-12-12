import FormToast from '@components/FormToast';
import {
  useNotifications,
  useResendNotification,
} from '@services/notifications';
import { Badge, ResourceItem, ResourceList, Text } from '@shopify/polaris';
import { format } from 'date-fns';
import { useState } from 'react';

export default ({ info }: BookingModalChildProps) => {
  const [response, setResponse] = useState<ReturnApi>();

  const { data } = useNotifications({
    orderId: info.orderId,
    lineItemId: info.lineItemId,
  });

  const { resend } = useResendNotification();

  return (
    <>
      {response && (
        <FormToast
          message={response.success ? 'Message send' : response.error}
          error={!response.success}
        />
      )}
      <ResourceList
        items={data.reverse()}
        loading={data.length === 0}
        renderItem={(item) => {
          const {
            _id: id,
            message,
            receiver,
            createdAt,
            scheduled,
            isStaff,
          } = item;
          const shortcutActions = [
            {
              content: 'Send Again',
              onAction: async () => {
                setResponse(await resend({ id }));
              },
            },
          ];

          return (
            <ResourceItem
              id={id}
              onClick={() => null}
              shortcutActions={shortcutActions}
              persistActions>
              <Text variant="bodySm" as="p">
                <b>Phone:</b> {receiver}{' '}
                <Badge size="small">
                  {isStaff ? 'Til medarbejder' : 'Til kunde'}
                </Badge>
              </Text>
              <Text variant="bodySm" as="p">
                <b>Send:</b> {format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}
              </Text>
              {scheduled && (
                <Text variant="bodySm" as="p">
                  <b>Planlagt</b>:{' '}
                  {format(new Date(scheduled), 'yyyy-MM-dd HH:mm')}
                </Text>
              )}
              <br />
              <Text variant="bodySm" as="h3">
                <i>{message}</i>
              </Text>
            </ResourceItem>
          );
        }}
      />
    </>
  );
};
