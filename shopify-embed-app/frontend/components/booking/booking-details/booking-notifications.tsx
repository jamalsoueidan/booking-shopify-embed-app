import { BookingResponse, Notification } from "@jamalsoueidan/bsb.mongodb.types";
import { useToast } from "@jamalsoueidan/bsf.bsf-pkg";
import { useNotification, useResendNotification } from "@services/notification";
import { Badge, EmptyState, ResourceItem, ResourceList, Text } from "@shopify/polaris";
import { format } from "date-fns";
import { useCallback } from "react";

export const BookingNotifications = ({ booking }: { booking: BookingResponse }) => {
  const { data } = useNotification({
    lineItemId: booking.lineItemId,
    orderId: booking.orderId,
  });

  const { resend } = useResendNotification();

  const { show } = useToast();

  const wrapResend = useCallback(
    async (id: string) => {
      const response = await resend({ id });
      show({
        content: response.success ? "Message send" : response.error,
        error: !response.success,
      });
    },
    [resend, show],
  );

  const empty = useCallback(() => null, []);

  const renderItem = useCallback(
    (item: Notification, id: string) => {
      const { _id, message, receiver, createdAt, scheduled, isStaff } = item;

      return (
        <ResourceItem
          id={id}
          onClick={empty}
          shortcutActions={[
            {
              content: "Send Again",
              onAction: () => wrapResend(_id),
            },
          ]}
          persistActions
        >
          <Text variant="bodySm" as="p">
            <b>Phone:</b> {receiver} <Badge size="small">{isStaff ? "Til medarbejder" : "Til kunde"}</Badge>
          </Text>
          <Text variant="bodySm" as="p">
            <b>Send:</b> {format(new Date(createdAt), "yyyy-MM-dd HH:mm")}
          </Text>
          {scheduled && (
            <Text variant="bodySm" as="p">
              <b>Planlagt</b>: {format(new Date(scheduled), "yyyy-MM-dd HH:mm")}
            </Text>
          )}
          <br />
          <Text variant="bodySm" as="h3">
            <i>{message}</i>
          </Text>
        </ResourceItem>
      );
    },
    [empty, wrapResend],
  );

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
    <ResourceList emptyState={emptyStateMarkup} items={data.reverse()} loading={!data} renderItem={renderItem as any} />
  );
};
