import {
  ControllerProps,
  WidgetServiceAvailability,
  WidgetServiceAvailabilityProps,
  WidgetServiceGetStaff,
  WidgetServiceGetStaffProps,
} from "@jamalsoueidan/pkg.bsb";

import { SettingModel } from "@jamalsoueidan/bsb.services.setting";

export const staff = ({
  query,
}: ControllerProps<WidgetServiceGetStaffProps>) => {
  return WidgetServiceGetStaff(query);
};

export const availability = async ({
  query,
}: ControllerProps<WidgetServiceAvailabilityProps>) =>
  WidgetServiceAvailability(query);

export const settings = () => {
  return SettingModel.findOne({}, "language status timeZone");
};
