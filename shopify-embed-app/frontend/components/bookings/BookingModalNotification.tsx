import { Notification } from '@jamalsoueidan/bsb.mongodb.types';
import { useToast } from '@providers/toast';
import { useNotification, useResendNotification } from '@services';
import {
  Badge,
  EmptyState,
  ResourceItem,
  ResourceList,
  Text,
} from '@shopify/polaris';
import { format } from 'date-fns';
import { useCallback } from 'react';

export default ({ info }: BookingModalProps) => {
  const { data } = useNotification({
    orderId: info.orderId,
    lineItemId: info.lineItemId,
  });

  const { resend } = useResendNotification();
  const { show } = useToast();

  const wrapResend = useCallback(
    async (id: string) => {
      const response = await resend({ id });
      show({
        content: response.success ? 'Message send' : response.error,
        error: !response.success,
      });
    },
    [resend]
  );

  const empty = useCallback(() => null, []);

  const renderItem = useCallback((item: Notification) => {
    const { _id: id, message, receiver, createdAt, scheduled, isStaff } = item;

    return (
      <ResourceItem
        id={id}
        onClick={empty}
        shortcutActions={[
          {
            content: 'Send Again',
            onAction: () => wrapResend(id),
          },
        ]}
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
            <b>Planlagt</b>: {format(new Date(scheduled), 'yyyy-MM-dd HH:mm')}
          </Text>
        )}
        <br />
        <Text variant="bodySm" as="h3">
          <i>{message}</i>
        </Text>
      </ResourceItem>
    );
  }, []);

  const emptyStateMarkup =
    data?.length === 0 ? (
      <>
        <br />
        <EmptyState heading="Notification empty" image={null}>
          <p>No notification is send yet!</p>
        </EmptyState>
      </>
    ) : undefined;

  return (
    <ResourceList
      emptyState={emptyStateMarkup}
      items={data.reverse()}
      loading={!data}
      renderItem={renderItem as any}
    />
  );
};
