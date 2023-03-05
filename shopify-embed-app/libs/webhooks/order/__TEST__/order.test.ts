import { faker } from "@faker-js/faker";
import {
    BookingServiceGetAll,
    IProductDocument,
    ShopifySessionModel,
} from "@jamalsoueidan/pkg.backend";
import { createProduct } from "@libs/jest-helpers";
import * as OrderWebhook from "@libs/webhooks/order/order.webhook";
import { differenceInMinutes, isAfter, isBefore } from "date-fns";
import mongoose from "mongoose";
import { Data, LineItem } from "../order.types";
import mockCreate from "./mock.create";
import mockOneFullfiledOneRefund from "./mock.oneFullfiled-oneRefund";
import mockOneFullfilledOneOnHold from "./mock.oneFullfilled-oneOnHold";

declare var global: Record<string, string>;

jest.mock("@libs/smsdk/smsdk.api", () => {
  return {
    __esModule: true,
    default: {
      send: jest.fn(async ({ receiver, message, scheduled }) =>
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

const productId = 7961951273277; //refere to the product in the orderJSON
let product: IProductDocument;

const createInterval = (line_items: LineItem[]) => {
  return line_items.reduce(
    (previousValue, lineItem) => {
      const _data = lineItem.properties.find((p) => p.name === "_data")?.value;

      if (_data) {
        const data: Data = JSON.parse(_data);

        if (isBefore(new Date(data.start), previousValue.start)) {
          previousValue.start = new Date(data.start);
        }

        if (isAfter(new Date(data.end), previousValue.end)) {
          previousValue.end = new Date(data.start);
        }
      }
      return previousValue;
    },
    { start: new Date(), end: new Date() },
  );
};

describe("webhooks order", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    return mongoose.connection.close();
  });

  it("Should create booking", async () => {
    await ShopifySessionModel.create({
      id: "offline_testeriphone.myshopify.com",
      shop: "testeriphone.myshopify.com",
      state: "offline_095054804630505",
      isOnline: false,
      accessToken: "shpua_e7362500a3939ff163314ffee79cc395",
      scope:
        "unauthenticated_read_product_listings,write_products,write_orders,read_customers",
    });

    product = await createProduct({ productId });

    await OrderWebhook.create({ body: mockCreate, shop: global.shop });

    const interval = createInterval(mockCreate.line_items);

    const result = await BookingServiceGetAll({
      shop: global.shop,
      start: interval.start,
      end: interval.end,
    });

    expect(result.length).toEqual(mockCreate.line_items.length);

    const order1 = result[0];
    expect(order1.orderId).toEqual(mockCreate.id);
    expect(order1.productId).toBe(mockCreate.line_items[0].product_id);
    expect(
      differenceInMinutes(new Date(order1.end), new Date(order1.start)),
    ).toEqual(product.duration + product.buffertime);

    const order2 = result[1];
    expect(order2.anyAvailable).toBeTruthy();
  });

  it("Should have one fullfilled", async () => {
    await OrderWebhook.update({
      body: mockOneFullfilledOneOnHold,
      shop: global.shop,
    });

    const interval = createInterval(mockCreate.line_items);

    const result = await BookingServiceGetAll({
      shop: global.shop,
      start: interval.start,
      end: interval.end,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fulfillmentStatus: "fulfilled",
        }),
      ]),
    );
  });

  it("Should have one fullfilled and another on refund", async () => {
    await OrderWebhook.update({
      body: mockOneFullfiledOneRefund,
      shop: global.shop,
    });

    const interval = createInterval(mockCreate.line_items);

    const result = await BookingServiceGetAll({
      shop: global.shop,
      start: interval.start,
      end: interval.end,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fulfillmentStatus: "refunded",
        }),
      ]),
    );

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fulfillmentStatus: "fulfilled",
        }),
      ]),
    );
  });

  it("Should cancel the order upon receiving the cancel event.", async () => {
    await OrderWebhook.cancel({
      body: mockOneFullfiledOneRefund,
      shop: global.shop,
    });

    const interval = createInterval(mockCreate.line_items);

    const result = await BookingServiceGetAll({
      shop: global.shop,
      start: interval.start,
      end: interval.end,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fulfillmentStatus: "cancelled",
        }),
      ]),
    );
  });
});
