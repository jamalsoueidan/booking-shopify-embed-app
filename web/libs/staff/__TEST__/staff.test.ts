import mongoose from "mongoose";
import staffController from "../staff.controller";

describe("Admin-staff controller", () => {
  beforeAll(() => mongoose.connect(global.__MONGO_URI__));
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    return mongoose.connection.close();
  });

  it("Should create a staff", async () => {
    const query = {
      shop: global.shop,
    };

    const body = {
      fullname: "jamasdeidan",
      email: "test@test.com",
      phone: "+4531317428",
      avatar: "https://test.dk/test.png",
      position: "1",
    };

    const createSetting = await staffController.create({ query, body });
    expect(createSetting.fullname).toEqual(body.fullname);
  });

  it("Should get list of staff", async () => {
    const query = {
      shop: global.shop,
    };

    const allStaff = await staffController.get({ query });
    expect(allStaff.length).toEqual(1);
  });

  it("Should update staff", async () => {
    const query = {
      shop: global.shop,
    };

    const allStaff = await staffController.get({ query });
    const staff = allStaff.pop();

    const body = {
      fullname: "jamal soueidan",
    };

    const updateStaff = await staffController.update({
      query: {
        id: staff._id,
      },
      body,
    });
    expect(updateStaff.fullname).toEqual(body.fullname);
  });

  it("Should get one staff by id", async () => {
    const query = {
      shop: global.shop,
    };

    const allStaff = await staffController.get({ query });
    const staff = allStaff.pop();

    const oneStaff = await staffController.getById({
      query: {
        ...query,
        id: staff._id,
      },
    });
    expect(oneStaff._id).toEqual(staff._id);
  });
});
