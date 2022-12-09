import { useNotifications } from '@services/notifications';
import { Button, ResourceItem, ResourceList, Text } from '@shopify/polaris';
import { format } from 'date-fns';

export default ({ info }: BookingModalChildProps) => {
  const { data } = useNotifications({
    orderId: info.orderId,
    lineItemId: info.lineItemId,
  });

  return (
    <>
      <ResourceList
        resourceName={{ singular: 'message', plural: 'messages' }}
        items={data}
        loading={data.length === 0}
        alternateTool={<Button>Send new message</Button>}
        renderItem={(item) => {
          const { _id, message, receiver, createdAt, scheduled } = item;
          const shortcutActions = [
            {
              content: 'Send Again',
              onAction: () => {},
            },
          ];

          return (
            <ResourceItem
              id={_id}
              onClick={() => null}
              shortcutActions={shortcutActions}
              persistActions>
              <Text variant="bodySm" as="p">
                <b>Phone:</b> {receiver}
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
                {message}
              </Text>
            </ResourceItem>
          );
        }}
      />
    </>
  );
};
