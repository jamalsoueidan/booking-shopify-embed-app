import { faker } from "@faker-js/faker";
import {
  BookingModel,
  CartModel,
  StaffServiceFindByIdAndUpdate,
} from "@jamalsoueidan/bsb.bsb-pkg";
import {
  createProduct,
  createStaffAndUpdateProduct,
  createStaffWithSchedule,
} from "@libs/jest-helpers";
import * as widgetController from "@libs/widget/widget.controller";
import productService from "@services/product.service";
import { addDays, format } from "date-fns";
import mongoose from "mongoose";

describe("admin-widget controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    return mongoose.connection.close();
  });

  it("Should find a staff after adding staff to the product", async () => {
    const productId = parseInt(faker.random.numeric(10));
    const tag = faker.random.word();
    const product = await createProduct({ productId });

    await createStaffAndUpdateProduct({
      product,
      tag,
    });
    const query = {
      shop: global.shop as string,
      productId,
    };

    let allStaff = await widgetController.staff({
      query,
    });
    expect(allStaff.length).toEqual(1);
  });

  it("Should not include inactive staff.", async () => {
    const productId = parseInt(faker.random.numeric(10));
    const tag = faker.random.word();

    const product = await createProduct({ productId });
    const { staff } = await createStaffAndUpdateProduct({ product, tag });

    await StaffServiceFindByIdAndUpdate(staff._id, {
      active: false,
    });

    const query = {
      shop: global.shop,
      productId: productId,
    };

    const allStaff = await widgetController.staff({ query });
    expect(allStaff.length).toEqual(0);
  });

  it("Should return staff hours on a specified day", async () => {
    const productId = parseInt(faker.random.numeric(10));
    const tag = faker.random.word();

    const product = await createProduct({ productId });
    const { staff } = await createStaffAndUpdateProduct({ product, tag });

    // prepare a product
    const query = {
      shop: global.shop,
      productId: product.productId,
      start: format(new Date(), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      staffId: staff._id,
    };

    const availability = await widgetController.availability({ query });
    expect(availability.length).toEqual(1);
  });

  it("Should not return hours that are booked already", async () => {
    const productId = parseInt(faker.random.numeric(10));
    const tag = faker.random.word();

    const product = await createProduct({ productId });
    const { staff } = await createStaffAndUpdateProduct({ product, tag });

    // prepare a product
    const query = {
      shop: global.shop,
      productId: product.productId,
      start: format(new Date(), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      staffId: staff._id,
    };

    let availability = await widgetController.availability({ query });
    let availabilityDay = availability.at(0);
    const schedule = availabilityDay.hours.at(3);

    await BookingModel.create({
      orderId: 1000,
      lineItemId: 1100,
      lineItemTotal: 1,
      productId: productId,
      staff: schedule.staff._id,
      start: schedule.start,
      end: schedule.end,
      shop: global.shop,
      fulfillmentStatus: "refunded",
      customerId: 12345,
      title: "anything",
      timeZone: "Europe/Paris",
    });

    availability = await widgetController.availability({ query });
    availabilityDay = availability.at(0);
    const hours = availabilityDay.hours.filter(
      (h) => h.start === schedule.start && h.end === schedule.end,
    );
    expect(hours.length).toEqual(0);
  });

  it("Should not return hours that are in cart", async () => {
    const productId = parseInt(faker.random.numeric(10));
    const tag = faker.random.word();

    const product = await createProduct({ productId });
    const { staff } = await createStaffAndUpdateProduct({ product, tag });

    // prepare a product
    const query = {
      shop: global.shop,
      productId: product.productId,
      start: format(new Date(), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      staffId: staff._id,
    };

    let availability = await widgetController.availability({ query });
    let availabilityDay = availability.at(0);
    const schedule = availabilityDay.hours.at(3);

    await CartModel.create({
      cartId: "asd",
      staff: schedule.staff._id,
      start: schedule.start,
      end: schedule.end,
      shop: global.shop,
    });

    availability = await widgetController.availability({ query });
    availabilityDay = availability.at(0);
    const hours = availabilityDay.hours.filter(
      (h) => h.start === schedule.start && h.end === schedule.end,
    );
    expect(hours.length).toEqual(0);
  });

  it("Should return hours for all staff on product", async () => {
    const productId = parseInt(faker.random.numeric(10));
    const tag = faker.random.word();

    const product = await createProduct({ productId });

    const { staff: staff1 } = await createStaffWithSchedule({ tag });
    const { staff: staff2 } = await createStaffWithSchedule({ tag });

    await productService.update({
      query: {
        shop: global.shop,
        id: product._id,
      },
      body: {
        staff: [
          { _id: staff1._id, tag },
          { _id: staff2._id, tag },
        ],
      },
    });

    const query = {
      shop: global.shop,
      productId: product.productId,
      start: format(new Date(), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    };

    const availability = await widgetController.availability({ query });
    const fullnames = [
      ...new Set(availability.at(0).hours.map((h) => h.staff.fullname)),
    ];
    expect(fullnames.length).toEqual(2);
  });
});
