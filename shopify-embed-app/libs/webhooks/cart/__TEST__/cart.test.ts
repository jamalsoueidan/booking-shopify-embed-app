import { IProductDocument, ShopifySessionModel, Tag } from "@jamalsoueidan/pkg.bsb";
import { createProduct, createSchedule, createStaff } from "@libs/jest-helpers";
import * as adminProductController from "@libs/product/product.controller";
import * as CartWebhook from "@libs/webhooks/cart/cart.webhook";
import { addHours, setMilliseconds, setSeconds, startOfDay } from "date-fns";
import mongoose from "mongoose";
import body from "./cart.mock";

const productId = 8006173360445; //refere to the product in the orderJSON
let product: IProductDocument;

declare var global: Record<string, string>;

const tag = Tag.end_of_week;

describe("webhooks order", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create cart item when we recieve data from cart/create or cart/update", async () => {
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

    const staff1 = await createStaff();

    const date = startOfDay(new Date());
    await createSchedule({
      tag,
      start: addHours(date, 5),
      end: addHours(date, 10),
      staff: staff1._id.toString(),
    });

    await adminProductController.update({
      query: {
        id: product._id,
        shop: global.shop,
      },
      body: {
        staff: [{ tag, _id: staff1._id }],
      },
    });

    const lineItems = body.line_items[0];
    lineItems.properties._data = JSON.stringify({
      timeZone: "Europe/Istanbul",
      start: addHours(setSeconds(setMilliseconds(date, 0), 0), 6).toISOString(),
      end: addHours(setSeconds(setMilliseconds(date, 0), 0), 7).toISOString(),
      staff: {
        staff: staff1._id,
        fullname: "Fida Soueidan",
        anyAvailable: false,
      },
    });

    const response = await CartWebhook.modify({ body, shop: global.shop });
    expect(response.length).toEqual(1);
  });
});
