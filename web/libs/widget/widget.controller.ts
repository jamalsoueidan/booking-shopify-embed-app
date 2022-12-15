import BookingService from "@services/booking.service";
import CartService from "@services/cart.service";
import ProductService from "@services/product.service";
import ScheduleService from "@services/schedule.service";
import helpers from "./widget.helpers";

export enum ControllerMethods {
  staff = "staff",
  availability = "availability",
}

export interface AvailabilityReturn extends WidgetSchedule {}

interface StaffQuery extends WidgetStaffQuery {
  shop: string;
}

const staff = ({
  query,
}: {
  query: StaffQuery;
}): Promise<Array<WidgetStaff>> => {
  const { productId, shop } = query;
  return ProductService.getAllStaff({
    shop,
    productId: +productId,
  });
};

interface AvailabilityQuery extends Omit<WidgetDateQuery, "staff"> {
  staff?: string;
  shop: string;
}

const availability = async ({
  query,
}: {
  query: AvailabilityQuery;
}): Promise<Array<WidgetSchedule>> => {
  const { staff, start, end, shop, productId } = query;

  const product = await ProductService.getProduct({
    shop,
    productId: +productId,
    staff,
  });

  const schedules = await ScheduleService.getByStaffAndTag({
    tag: product.staff.map((s) => s.tag),
    staff: product.staff.map((s) => s.staff),
    start,
    end,
  });

  const bookings = await BookingService.getBookingsForWidget({
    shop,
    staff: product.staff.map((s) => s.staff),
    start: new Date(start),
    end: new Date(end),
  });

  const carts = await CartService.getCartsByStaff({
    shop,
    staff: product.staff.map((s) => s.staff),
    start: new Date(start),
    end: new Date(end),
  });

  return helpers.calculate({ schedules, bookings, carts, product });
};

export default {
  staff,
  availability,
};
