import NotificationService from "@services/notification.service";

export enum ControllerMethods {
  get = "get",
  sendCustom = "sendCustom",
  resend = "resend",
}

const get = ({ query }) => {
  return NotificationService.get(query);
};

const sendCustom = ({ query, body }) => {
  return NotificationService.sendCustom({ ...query, ...body });
};

const resend = ({ query }) => {
  return NotificationService.resend(query);
};

export default { get, sendCustom, resend };
