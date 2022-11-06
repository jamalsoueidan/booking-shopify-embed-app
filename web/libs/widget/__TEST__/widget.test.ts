import mongoose from "mongoose";
import widgetController from "../widget.controller";

describe("Widget controller", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
  it("Should get staff for specific product", async () => {
    const query = {
      productId: "asd",
      shop: "test",
    };
    try {
      const user = await widgetController.staff({ query });
    } catch (error) {}
  });

  it("Should enforce the gender ennum", async () => {});
});
