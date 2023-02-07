import {
  BookingServiceGetForWidget,
  CartServiceGetByStaff,
  ControllerProps,
  ScheduleServiceGetByStaffAndTag,
  SettingModel,
  WidgetServiceCalculator,
  WidgetServiceGetProduct,
  WidgetServiceGetStaff,
} from "@jamalsoueidan/bsb.bsb-pkg";

export const staff = ({ query }: ControllerProps<WidgetStaffQuery>) => {
  const { productId, shop } = query;
  return WidgetServiceGetStaff({
    shop,
    productId: +productId,
  });
};

interface AvailabilityQuery extends Omit<WidgetDateQuery, "staff"> {
  staff?: string;
}

export const availability = async ({
  query,
}: ControllerProps<AvailabilityQuery>) => {
  const { staff, start, end, shop, productId } = query;

  const product = await WidgetServiceGetProduct({
    shop,
    productId: +productId,
    staff,
  });

  const schedules = await ScheduleServiceGetByStaffAndTag({
    tag: product.staff.map((s) => s.tag),
    staff: product.staff.map((s) => s.staff),
    start,
    end,
  });

  const bookings = await BookingServiceGetForWidget({
    shop,
    staff: product.staff.map((s) => s.staff),
    start: new Date(start),
    end: new Date(end),
  });

  const carts = await CartServiceGetByStaff({
    shop,
    staff: product.staff.map((s) => s.staff),
    start: new Date(start),
    end: new Date(end),
  });

  return WidgetServiceCalculator({ schedules, bookings, carts, product });
};

export const settings = () => {
  return SettingModel.findOne({}, "language status timeZone");
};
