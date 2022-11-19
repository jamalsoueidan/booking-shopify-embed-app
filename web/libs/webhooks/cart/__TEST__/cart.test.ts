import adminProductController from "@libs/admin-product/admin-product.controller";
import { createProduct, createSchedule, createStaff } from "@libs/jest-helpers";
import CartWebhook from "@libs/webhooks/cart/cart.webhook";
import { IProductModel } from "@models/product.model";
import ShopifySessions from "@models/shopify-sessions.model";
import { addHours, setMilliseconds, setSeconds } from "date-fns";
import mongoose from "mongoose";
import body from "./cart.mock";

const productId = 8006173360445; //refere to the product in the orderJSON
let product: IProductModel;

const tag = "testerne";

describe("webhooks order", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create cart item when we recieve data from cart/create or cart/update", async () => {
    await ShopifySessions.create({
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

    await createSchedule({
      tag,
      start: new Date(),
      end: addHours(new Date(), 5),
      staff: staff1._id.toString(),
    });

    let updatedProduct: IProductModel;
    updatedProduct = await adminProductController.addStaff({
      query: {
        shop: global.shop,
        id: product["_id"],
      },
      body: {
        tag,
        staff: staff1._id.toString(),
      },
    });

    const lineItems = body.line_items[0];
    lineItems.properties._data = JSON.stringify({
      timeZone: "Europe/Istanbul",
      start: addHours(
        setSeconds(setMilliseconds(new Date(), 0), 0),
        1
      ).toISOString(),
      end: addHours(
        setSeconds(setMilliseconds(new Date(), 0), 0),
        2
      ).toISOString(),
      staff: {
        staff: staff1._id.toString(),
        fullname: "Fida Soueidan",
        anyStaff: false,
      },
    });

    await CartWebhook.modify({ body, shop: global.shop });
  });
});
