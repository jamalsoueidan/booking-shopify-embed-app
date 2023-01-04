import { faker } from "@faker-js/faker";
import bookingController from "@libs/booking/booking.controller";
import {
  createCustomer,
  createProduct,
  createSchedule,
  createStaff,
} from "@libs/jest-helpers";
import notificationController from "@libs/notification/notification.controller";
import { SendProps } from "@libs/smsdk/smsdk.api";
import { IProductModel } from "@models/product.model";
import { IStaffModel } from "@models/staff.model";
import { addHours } from "date-fns";
import mongoose from "mongoose";

jest.mock("@libs/smsdk/smsdk.api", () => {
  return {
    __esModule: true,
    default: {
      send: jest.fn(async ({ receiver, message, scheduled }: SendProps) =>
        Promise.resolve({
          status: "success",
          result: {
            batchId: faker.random.numeric(10),
          },
        })
      ),
    },
  };
});

const productId = 123456789;
let product: IProductModel;
let staff1: IStaffModel;
const tag = "testerne";

describe("admin-product controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it("Should find by id", async () => {
    product = await createProduct({ productId });

    staff1 = await createStaff();

    await createSchedule({
      tag,
      start: new Date(),
      end: addHours(new Date(), 5),
      staff: staff1._id,
    });

    const customer = await createCustomer();

    const bookingCreate = await bookingController.create({
      query: { shop: global.shop },
      body: {
        productId,
        customerId: customer.customerId,
        start: "2023-01-29T11:15:00.000Z",
        end: "2023-01-29T12:15:00.000Z",
        staff: staff1._id.toString(),
      },
    });

    const notifications = await notificationController.get({
      query: {
        shop: global.shop,
        orderId: bookingCreate.orderId,
        lineItemId: bookingCreate.lineItemId,
      },
    });

    console.log(notifications);
  });
});
