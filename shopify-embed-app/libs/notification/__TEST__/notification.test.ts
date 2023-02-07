import { faker } from "@faker-js/faker";
import {
  IBookingDocument,
  ICustomerDocument,
  IProductDocument,
  IStaffDocument,
  SmsDkApiCancel,
  SmsDkApiSend,
} from "@jamalsoueidan/bsb.bsb-pkg";
import * as bookingController from "@libs/booking/booking.controller";
import {
  createCustomer,
  createProduct,
  createSchedule,
  createStaff,
} from "@libs/jest-helpers";
import * as notificationController from "@libs/notification/notification.controller";
import { addHours } from "date-fns";
import mongoose from "mongoose";
import waitForExpect from "wait-for-expect";

// TODO: Fix mock of
jest.mock("@libs/smsdk/smsdk.api", () => {
  return {
    __esModule: true,
    default: {
      send: jest.fn(() =>
        Promise.resolve({
          status: "success",
          result: {
            batchId: faker.random.numeric(10),
          },
        }),
      ),
      cancel: jest.fn(() =>
        Promise.resolve({
          status: "success",
          result: {
            batchId: faker.random.numeric(10),
          },
        }),
      ),
    },
  };
});

const productId = 123456789;
let product: IProductDocument;
let staff: IStaffDocument;
let customer: ICustomerDocument;
let booking: IBookingDocument;
const tag = "testerne";

describe("admin-notification controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    return mongoose.connection.close();
  });

  it("When creating booking, must send 3 notifications", async () => {
    product = await createProduct({ productId });

    staff = await createStaff();

    await createSchedule({
      tag,
      start: new Date(),
      end: addHours(new Date(), 5),
      staff: staff._id,
    });

    customer = await createCustomer();

    booking = await bookingController.create({
      query: { shop: global.shop },
      body: {
        productId,
        customerId: customer.customerId,
        start: "2023-11-29T11:15:00.000Z",
        end: "2023-11-29T12:15:00.000Z",
        staff: staff._id.toString(),
      },
    });

    const notifications = await notificationController.get({
      query: {
        shop: global.shop,
        orderId: booking.orderId,
        lineItemId: booking.lineItemId,
      },
    });

    await waitForExpect(() => {
      expect(SmsDkApiSend).toHaveBeenCalledTimes(3);
    });

    expect(notifications.length).toBe(3);
  });

  it("When updating booking, must cancel all previous scheduled notifications and send 2 new scheduled notifications", async () => {
    (SmsDkApiSend as any).mockClear();

    await bookingController.update({
      query: { shop: global.shop, id: booking._id },
      body: {
        start: "2023-11-15T12:15:00.000Z",
        end: "2023-11-15T13:15:00.000Z",
        staff: staff._id.toString(),
      },
    });

    await waitForExpect(() => {
      expect(SmsDkApiCancel).toHaveBeenCalledTimes(2);
    });

    await waitForExpect(() => {
      expect(SmsDkApiSend).toHaveBeenCalledTimes(3);
    });

    const notifications = await notificationController.get({
      query: {
        shop: global.shop,
        orderId: booking.orderId,
        lineItemId: booking.lineItemId,
      },
    });

    expect(notifications.filter((n) => n.status === "cancelled").length).toBe(
      2,
    );

    expect(notifications.filter((n) => n.status === "pending").length).toBe(2);
  });
});
