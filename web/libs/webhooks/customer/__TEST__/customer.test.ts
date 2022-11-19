import CustomerWebhook from "@libs/webhooks/customer/customer.webhook";
import { IProductModel } from "@models/product.model";
import ShopifySessions from "@models/shopify-sessions.model";
import mongoose from "mongoose";
import body from "./customer.mock";

const productId = 7961951273277; //refere to the product in the orderJSON
let product: IProductModel;

describe("webhooks order", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create or update customer when we recieve data from webhook", async () => {
    await ShopifySessions.create({
      id: "offline_testeriphone.myshopify.com",
      shop: "testeriphone.myshopify.com",
      state: "offline_095054804630505",
      isOnline: false,
      accessToken: "shpua_e7362500a3939ff163314ffee79cc395",
      scope:
        "unauthenticated_read_product_listings,write_products,write_orders,read_customers",
    });

    const response = await CustomerWebhook.modify({ body, shop: global.shop });
    expect(response.upsertedCount).toEqual(1);
  });
});
