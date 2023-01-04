import { ICustomerModel } from "@models/customer.model";
import NotificationTemplateModel from "@models/notification-template.model";
import SettingModels from "@models/setting.models";
import { IStaffModel } from "@models/staff.model";
import { format, formatRelative, subDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import da from "date-fns/locale/da";

interface GetMessageProps {
  shop: string;
  type: string;
}

interface GetMessageReturn extends Setting, NotificationTemplate {}

const getNotificationTemplate = async ({
  type,
  shop,
}: GetMessageProps): Promise<GetMessageReturn> => {
  const setting = await SettingModels.findOne({ shop }).lean();
  const template = await NotificationTemplateModel.findOne({
    shop,
    name: type,
    language: setting.language,
  }).lean();

  if (!template) {
    return null;
  }

  return {
    ...setting,
    ...template,
  };
};

interface ReplaceMessageProps {
  receiver?: ICustomerModel | IStaffModel;
  booking?: Omit<Booking, "_id">;
}

const replace = (
  notificationTemplate: GetMessageReturn,
  replace: ReplaceMessageProps
) => {
  let message = notificationTemplate.message;
  if (replace.receiver) {
    message = message.replace(/{fullname}/g, replace.receiver.fullname);
  }

  if (replace.booking) {
    message = message.replace(
      /{time}/g,
      formatRelative(
        utcToZonedTime(
          new Date(replace.booking.start),
          notificationTemplate.timeZone
        ),
        utcToZonedTime(
          subDays(new Date(replace.booking.start), 1),
          notificationTemplate.timeZone
        ),
        { locale: da }
      )
    );
    message = message.replace(/{title}/g, replace.booking.title);
    message = message.replace(
      /{total}/g,
      replace.booking.lineItemTotal.toString()
    );
  }

  return message;
};

export default { getNotificationTemplate, replace };
