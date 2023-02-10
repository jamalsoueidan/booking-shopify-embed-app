import {
  ControllerProps,
  WidgetDateQuery,
  WidgetServiceAvailability,
  WidgetServiceGetStaff,
  WidgetStaffQuery,
} from "@jamalsoueidan/pkg.bsb";

import { SettingModel } from "@jamalsoueidan/bsb.services.setting";

export const staff = ({ query }: ControllerProps<WidgetStaffQuery>) => {
  return WidgetServiceGetStaff(query);
};

interface AvailabilityQuery extends Omit<WidgetDateQuery, "staff"> {
  staff?: string;
}

export const availability = async ({
  query,
}: ControllerProps<AvailabilityQuery>) => WidgetServiceAvailability(query);

export const settings = () => {
  return SettingModel.findOne({}, "language status timeZone");
};
