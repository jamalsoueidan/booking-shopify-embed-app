import {
  createStaff,
  createSchedule,
  createNewStaffAndAddToProductWithSchedule,
} from "./../../test-helpers/index";
import { addHours, format, setHours, setMinutes, setSeconds } from "date-fns";
import mongoose, { Document } from "mongoose";
import { ProductModel } from "../../../database/models/product";

import * as Staff from "../../../database/models/staff";
import { addStaffToProduct, createProduct } from "../../test-helpers";
import widgetController from "../widget.controller";
import { faker } from "@faker-js/faker";

const productId = faker.random.numeric(10);
const shopifyProductId = `gid://shopify/Product/${productId}`;

interface IProductModel extends ProductModel, Document {}
interface IStaffModel extends Staff.StaffModel, Document {}
let product: IProductModel;
let staff: IStaffModel;
let schedule: any;

const tag = "customTag";

describe("admin-product controller", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);

    // prepare a product
    product = await createProduct({ shopifyProductId });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
  it("Should find a staff after adding staff to the product", async () => {
    const {
      staff: newStaff,
      schedule: newSchedule,
      updateProduct,
    } = await createNewStaffAndAddToProductWithSchedule({
      product,
      tag,
    });

    staff = newStaff;
    schedule = newSchedule;

    const query = {
      shop: global.shop,
      productId,
    };

    let allStaff = await widgetController.staff({ query });
    expect(allStaff.length).toEqual(1);

    await createNewStaffAndAddToProductWithSchedule({ product, tag });
    allStaff = await widgetController.staff({ query });
    expect(allStaff.length).toEqual(2);
  });

  it("Should not include inactive staff.", async () => {
    staff = await Staff.findByIdAndUpdate(staff._id, { active: false });

    const query = {
      shop: global.shop,
      productId,
    };

    const allStaff = await widgetController.staff({ query });
    expect(allStaff.length).toEqual(1);
  });

  it("Should return hours for the staff on specific day", async () => {
    const newStaff = await createStaff();
    const newSchedule = await createSchedule({
      tag,
      staff: newStaff._id.toString(),
      start: setMinutes(setMinutes(setSeconds(new Date(), 0), 0), 0),
      end: addHours(setMinutes(setSeconds(new Date(), 0), 0), 3),
    });

    const newProductID = faker.random.numeric(10);
    const newProduct = await createProduct({
      shopifyProductId: `gid://shopify/Product/${newProductID}`,
      duration: 60,
      buffertime: 0,
    });

    await addStaffToProduct({
      staff: newStaff,
      product: newProduct,
      tag,
    });

    // prepare a product
    const query = {
      shop: global.shop,
      productId: newProductID,
      date: format(new Date(), "yyyy-MM-dd"),
      staffId: newStaff._id.toString(),
    };

    const availabilityDay = await widgetController.availabilityDay({ query });
    expect(availabilityDay.length).toEqual(1);
    expect(availabilityDay[0].hours.length).toEqual(3);
  });
});
