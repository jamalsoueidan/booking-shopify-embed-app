import mongoose from "mongoose";
import settingController from "../setting.controller";

describe("admin-setting controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    return mongoose.connection.close();
  });

  it("Should create or update a setting", async () => {
    const query = {
      shop: global.shop,
    };

    const body = {
      language: "en",
    };

    const createSetting = await settingController.create({ query, body });
    expect(createSetting.language).toEqual(body.language);
  });

  it("Should find setting", async () => {
    const query = {
      shop: global.shop,
    };

    const findSetting = await settingController.get({ query });
    expect(findSetting.language).toEqual("en");
  });
});
