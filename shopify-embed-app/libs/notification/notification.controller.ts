import NotificationService from "@services/notification.service";

export enum ControllerMethods {
  get = "get",
  sendCustom = "sendCustom",
  resend = "resend",
  cancel = "cancel",
}

interface GetQuery {
  shop: string;
  orderId: number;
  lineItemId: number;
}

interface GetProps {
  query: GetQuery;
}

const get = ({ query }: GetProps) => {
  return NotificationService.get(query);
};

const sendCustom = ({ query, body }) => {
  return NotificationService.sendCustom({ ...query, ...body });
};

const resend = ({ query }) => {
  return NotificationService.resend(query);
};

const cancel = ({ query }) => {
  return NotificationService.cancel(query);
};

export default { get, sendCustom, resend, cancel };
