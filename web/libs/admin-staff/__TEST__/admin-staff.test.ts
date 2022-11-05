import mongoose from "mongoose";
import { SettingLanguage } from "../../../database/models/setting";
import staffController from "../admin-staff.controller";

describe("Admin-staff controller", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
  it("Should create a staff", async () => {
    const query = {
      shop: global.shop,
    };

    const body = {
      fullname: "jamasdeidan",
      email: "jamasduaeidan.com",
      phone: "+4531317428",
    };

    const createSetting = await staffController.create({ query, body });
    expect(createSetting.fullname).toEqual(body.fullname);
  });

  it("Should get list of staff", async () => {
    const query = {
      shop: global.shop,
    };

    const staff = await staffController.get({ query });
    expect(staff.length).toEqual(1);
  });

  it("Should update staff", async () => {
    const query = {
      shop: global.shop,
    };

    const staff = await staffController.get({ query });
    const user = staff[0];

    const params = {
      staff: staff[0]._id.toString(),
    };

    const body = {
      fullname: "jamal soueidan",
    };

    const updateStaff = await staffController.update({ params, body });
    expect(updateStaff.fullname).toEqual(body.fullname);
  });

  it("Should get one staff by id", async () => {
    const query = {
      shop: global.shop,
    };

    const staff = await staffController.get({ query });

    const params = {
      staff: staff[0]._id.toString(),
    };

    const oneStaff = await staffController.getById({ query, params });
    expect(oneStaff._id).toEqual(staff[0]._id);
  });
});
