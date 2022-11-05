import { Props } from "../../@types";
import * as Booking from "../../database/models/booking";
import * as Product from "../../database/models/product";
import * as Schedule from "../../database/models/schedule";
import helper, { ScheduleDate } from "./widget.helper";

interface StaffQuery extends Pick<Product.ProductModel, "productId" | "shop"> {}

const staff = async ({ query }: Props<StaffQuery>) => {
  const { productId, shop } = query;
  const staff = await Product.getAllStaff({ shop, productId });
  if (staff.length === 0) {
    throw "no staff or product exist";
  }
  return staff;
};

interface AvailabilityDayQuery
  extends Pick<Product.ProductModel, "productId" | "shop"> {
  date: string;
  staffId: string;
}

const availabilityDay = async ({ query }: Props<AvailabilityDayQuery>) => {
  const { staffId, date, productId, shop } = query;

  const product = await Product.getProductWithSelectedStaffId({
    shop,
    productId,
    staffId,
  });

  if (!product) {
    throw "no staff or product";
  }

  const schedules = await Schedule.getByStaffAndTag({
    tag: product.staff.tag,
    staff: product.staff.staff,
    start: date,
    end: date,
  });

  const bookings = await Booking.getBookingsByProductAndStaff({
    shop,
    productId,
    start: date,
    end: date,
    staffId: product.staff.staff,
  });

  let scheduleDates = schedules.reduce<Array<ScheduleDate>>(
    helper.scheduleReduce(product),
    []
  );

  bookings.forEach(
    (book) =>
      (scheduleDates = scheduleDates.map(helper.scheduleCalculateBooking(book)))
  );

  return scheduleDates;
};

interface AvailabilityRangeByStaffQuery
  extends Pick<Product.ProductModel, "productId" | "shop"> {
  staffId: string;
  start: string;
  end: string;
}

const availabilityRangeByStaff = async ({
  query,
}: Props<AvailabilityRangeByStaffQuery>) => {
  const { staffId, start, end, shop, productId } = query;

  const product = await Product.getProductWithSelectedStaffId({
    shop,
    productId,
    staffId,
  });

  if (!product) {
    throw "no staff or product";
  }

  const schedules = await Schedule.getByStaffAndTag({
    tag: product.staff.tag,
    staff: product.staff.staff,
    start,
    end,
  });

  const bookings = await Booking.getBookingsByProductAndStaff({
    shop,
    productId,
    staffId,
    start,
    end,
  });

  let scheduleDates = schedules.reduce(helper.scheduleReduce(product), []);

  bookings.forEach(
    (book) =>
      (scheduleDates = scheduleDates.map(helper.scheduleCalculateBooking(book)))
  );

  return scheduleDates;
};

interface AvailabilityRangeByAllQuery
  extends Pick<Product.ProductModel, "productId" | "shop"> {
  start: string;
  end: string;
}

const availabilityRangeByAll = async ({
  query,
}: Props<AvailabilityRangeByAllQuery>) => {
  const { start, end, shop, productId } = query;

  const product = await Product.findOne({
    shop,
    productId: "gid://shopify/Product/" + productId,
    active: true,
  });

  const schedules = await Schedule.getByTag({
    tag: product.staff.map((s) => s.tag),
    start,
    end,
  });

  const bookings = await Booking.getBookingsByProduct({
    shop,
    productId,
    start,
    end,
  });

  let scheduleDates = schedules.reduce(helper.scheduleReduce(product), []);

  bookings.forEach(
    (book) =>
      (scheduleDates = scheduleDates.map(helper.scheduleCalculateBooking(book)))
  );

  return scheduleDates;
};

export default {
  staff,
  availabilityDay,
  availabilityRangeByAll,
  availabilityRangeByStaff,
};