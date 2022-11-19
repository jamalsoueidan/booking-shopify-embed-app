import ShopifySessions from "@models/shopify-sessions.model";
import { differenceInMinutes } from "date-fns";
import { createProduct } from "@libs/jest-helpers";
import OrderWebhook from "@libs/webhooks/order/order.webhook";
import { IProductModel } from "@models/product.model";
import mongoose from "mongoose";
import body from "./order.mock";

const productId = 7961951273277; //refere to the product in the orderJSON
let product: IProductModel;

describe("webhooks order", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create booking when we recieve data from webhook", async () => {
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

    const result = await OrderWebhook.create({ body, shop: global.shop });
    expect(result.length).toEqual(3);

    const order1 = result[0];
    expect(order1.cancelled).toBeFalsy();
    expect(order1.orderId).toEqual(1016);
    expect(order1.productId).toBe(7961951273277);
    expect(differenceInMinutes(order1.end, order1.start)).toEqual(45);

    const order3 = result[2];
    expect(order3.anyStaff).toBeTruthy();
  });

  it("Should cancel booking when we recieve data from webhook", async () => {
    product = await createProduct({ productId });

    const result = await OrderWebhook.cancel({ body, shop: global.shop });
    expect(result.modifiedCount).toEqual(3);
  });
});
