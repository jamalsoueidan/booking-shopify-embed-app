import mongoose from "mongoose";
import settingController from "../admin-setting.controller";

describe("admin-setting controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create or update a setting", async () => {
    const query = {
      shop: global.shop,
    };

    const body = {
      language: SettingLanguage.en,
    };

    const createSetting = await settingController.create({ query, body });
    expect(createSetting.language).toEqual(SettingLanguage.en);
  });

  it("Should find setting", async () => {
    const query = {
      shop: global.shop,
    };

    const findSetting = await settingController.get({ query });
    expect(findSetting.language).toEqual(SettingLanguage.en);
  });
});
