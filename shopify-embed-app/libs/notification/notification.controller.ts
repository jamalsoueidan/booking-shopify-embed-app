import {
  NotificationServiceCancel,
  NotificationServiceGet,
  NotificationServiceResend,
  NotificationServiceSendCustom,
} from "@jamalsoueidan/bsb.bsb-pkg";

interface GetQuery {
  shop: string;
  orderId: number;
  lineItemId: number;
}

interface GetProps {
  query: GetQuery;
}

export const get = ({ query }: GetProps) => {
  return NotificationServiceGet(query);
};

export const sendCustom = ({ query, body }) => {
  return NotificationServiceSendCustom({ ...query, ...body });
};

export const resend = ({ query }) => {
  return NotificationServiceResend(query);
};

export const cancel = ({ query }) => {
  return NotificationServiceCancel(query);
};
