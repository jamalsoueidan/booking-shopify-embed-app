import BookingService from "@services/booking.service";
import CartService from "@services/cart.service";
import ProductService from "@services/product.service";
import ScheduleService from "@services/schedule.service";
import mongoose from "mongoose";
import helpers from "./widget.helpers";

export enum ControllerMethods {
  staff = "staff",
  availabilityDay = "availabilityDay",
  availabilityRangeByStaff = "availabilityRangeByStaff",
  availabilityRangeByAll = "availabilityRangeByAll",
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

interface AvailabilityRangeByStaffQuery extends WidgetDateQuery {
  shop: string;
}

const availabilityRangeByStaff = async ({
  query,
}: {
  query: AvailabilityRangeByStaffQuery;
}): Promise<Array<WidgetSchedule>> => {
  const { staff, start, end, shop, productId } = query;

  const product = await ProductService.getProductWithSelectedStaffId({
    shop,
    productId: +productId,
    staff: new mongoose.Types.ObjectId(staff),
  });

  if (!product) {
    throw "no staff or product";
  }

  const schedules = await ScheduleService.getByStaffAndTag({
    tag: product.staff.tag,
    staff: product.staff.staff,
    start,
    end,
  });

  const bookings = await BookingService.getBookingsForWidget({
    shop,
    staff: product.staff.staff,
    start: new Date(start),
    end: new Date(end),
  });

  let scheduleDates = schedules.reduce(helpers.scheduleReduce(product), []);

  bookings.forEach((book) => {
    scheduleDates = scheduleDates.map(
      helpers.scheduleCalculateBooking({
        end: book.end,
        start: book.start,
        staff: book.staff._id,
      })
    );
  });

  const carts = await CartService.getCartsByStaff({
    shop,
    staff: product.staff.staff,
    start: new Date(start),
    end: new Date(end),
  });

  carts.forEach((cart) => {
    scheduleDates = scheduleDates.map(helpers.scheduleCalculateBooking(cart));
  });

  return scheduleDates;
};

interface AvailabilityRangeByAllQuery extends Omit<WidgetDateQuery, "staff"> {
  shop: string;
}

const availabilityRangeByAll = async ({
  query,
}: {
  query: AvailabilityRangeByAllQuery;
}): Promise<Array<WidgetSchedule>> => {
  const { start, end, shop, productId } = query;
  const product = await ProductService.findOne({
    shop,
    productId,
    active: true,
  });

  const schedules = await ScheduleService.getByTag({
    tag: product.staff.map((s) => s.tag),
    staffier: product.staff.map((s) => s.staff),
    start,
    end,
  });

  const bookings = await BookingService.getBookingsForWidget({
    shop,
    staff: product.staff.map((s) => s.staff),
    start: new Date(start),
    end: new Date(end),
  });

  let scheduleDates = schedules.reduce(helpers.scheduleReduce(product), []);

  bookings.forEach((book) => {
    scheduleDates = scheduleDates.map(
      helpers.scheduleCalculateBooking({
        end: book.end,
        start: book.start,
        staff: book.staff._id,
      })
    );
  });

  const carts = await CartService.getCartsByStaffier({
    shop,
    staffier: product.staff.map((s) => s.staff),
    start: new Date(start),
    end: new Date(end),
  });

  carts.forEach((cart) => {
    scheduleDates = scheduleDates.map(helpers.scheduleCalculateBooking(cart));
  });

  return scheduleDates;
};

export default {
  staff,
  availabilityRangeByAll,
  availabilityRangeByStaff,
};
