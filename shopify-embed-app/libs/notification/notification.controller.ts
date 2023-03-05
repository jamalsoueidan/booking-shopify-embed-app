import {
    NotificationServiceCancel,
    NotificationServiceGet,
    NotificationServiceResend,
    NotificationServiceSendCustom,
} from "@jamalsoueidan/pkg.backend";

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

export const sendCustom = ({ query, body }: any) => {
  return NotificationServiceSendCustom({ ...query, ...body });
};

export const resend = ({ query }: any) => {
  return NotificationServiceResend(query);
};

export const cancel = ({ query }: any) => {
  return NotificationServiceCancel(query);
};
