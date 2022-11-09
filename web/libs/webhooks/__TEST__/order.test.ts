import { createProduct } from "@libs/jest-helpers";
import { IProductModel } from "@models/product.model";
import ProductService from "@services/product.service";
import { createOrUpdate } from "@libs/webhooks/order.webhook";
import mongoose from "mongoose";
import body from "./order.mock";

const productId = 7961951273277; //refere to the product in the orderJSON
let product: IProductModel;

describe("webhooks order", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create a staff", async () => {
    product = await createProduct({ productId });

    const result = await createOrUpdate(body);
    console.log(result);
  });
});
