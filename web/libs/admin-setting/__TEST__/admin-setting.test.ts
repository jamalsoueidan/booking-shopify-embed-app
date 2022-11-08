import mongoose from "mongoose";
import { ISettingLanguage } from "@models/setting.models";
import settingController from "../admin-setting.controller";

describe("admin-setting controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(() => mongoose.disconnect());

  it("Should create or update a setting", async () => {
    const query = {
      shop: global.shop,
    };

    const body = {
      language: ISettingLanguage.en,
    };

    const createSetting = await settingController.create({ query, body });
    expect(createSetting.language).toEqual(ISettingLanguage.en);
  });

  it("Should find setting", async () => {
    const query = {
      shop: global.shop,
    };

    const findSetting = await settingController.get({ query });
    expect(findSetting.language).toEqual(ISettingLanguage.en);
  });
});
