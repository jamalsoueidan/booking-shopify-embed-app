import {
  addDays,
  addHours,
  format,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
  subHours,
} from "date-fns";
import mongoose, { Document } from "mongoose";
import { ProductModel } from "../../../database/models/product";
import {
  createNewStaffAndAddToProductWithSchedule,
  createSchedule,
  createStaff,
} from "./../../test-helpers/index";

import { faker } from "@faker-js/faker";
import * as Staff from "../../../database/models/staff";
import { addStaffToProduct, createProduct } from "../../test-helpers";
import widgetController from "../widget.controller";

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

  it("Should return staff hours on a specified day", async () => {
    const newStaff = await createStaff();

    const start = setMinutes(new Date(), 0);
    const end = addHours(setMinutes(new Date(), 0), 3);
    const newSchedule = await createSchedule({
      staff: newStaff._id.toString(),
      tag,
      start,
      end,
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
    const day = availabilityDay[0];
    expect(day.hours.length).toEqual(3);
    const first = day.hours[0];
    expect(first.start).toEqual(setSeconds(setMilliseconds(start, 0), 0));
    const last = day.hours[day.hours.length - 1];
    expect(last.end).toEqual(setSeconds(setMilliseconds(end, 0), 0));
  });

  it("Should return staff hours to a specified day range", async () => {
    const newStaff = await createStaff();

    const firstStartSchedule = setMinutes(new Date(), 0);
    const firstEndSchedule = addHours(setMinutes(new Date(), 0), 3);
    await createSchedule({
      staff: newStaff._id.toString(),
      tag,
      start: firstStartSchedule,
      end: firstEndSchedule,
    });

    const secondStartSchedule = subDays(subHours(firstStartSchedule, 3), 1);
    const secondEndSchedule = subDays(firstEndSchedule, 1);
    await createSchedule({
      staff: newStaff._id.toString(),
      tag,
      start: secondStartSchedule,
      end: secondEndSchedule,
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

    const query = {
      shop: global.shop,
      productId: newProductID,
      start: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      staffId: newStaff._id.toString(),
    };

    const availabilityRangeByStaff =
      await widgetController.availabilityRangeByStaff({
        query,
      });

    expect(availabilityRangeByStaff.length).toEqual(2);

    const first = availabilityRangeByStaff[0];

    let firstHour = first.hours[0];
    expect(firstHour.start).toEqual(
      setSeconds(setMilliseconds(secondStartSchedule, 0), 0)
    );
    let lastHour = first.hours[first.hours.length - 1];
    expect(lastHour.end).toEqual(
      setSeconds(setMilliseconds(secondEndSchedule, 0), 0)
    );

    const last = availabilityRangeByStaff[1];
    expect(last.hours.length).toEqual(3);

    firstHour = last.hours[0];
    expect(firstHour.start).toEqual(
      setSeconds(setMilliseconds(firstStartSchedule, 0), 0)
    );
    lastHour = last.hours[last.hours.length - 1];
    expect(lastHour.end).toEqual(
      setSeconds(setMilliseconds(firstEndSchedule, 0), 0)
    );
  });

  it("Should return hours for all staff on product", async () => {
    const newProductID = faker.random.numeric(10);
    const newProduct = await createProduct({
      shopifyProductId: `gid://shopify/Product/${newProductID}`,
      duration: 60,
      buffertime: 0,
    });

    const newStaff = await createStaff();

    const firstStartSchedule = setMinutes(new Date(), 0);
    const firstEndSchedule = addHours(setMinutes(new Date(), 0), 2);
    await createSchedule({
      staff: newStaff._id.toString(),
      tag,
      start: firstStartSchedule,
      end: firstEndSchedule,
    });

    const secondStartSchedule = subDays(firstStartSchedule, 1);
    const secondEndSchedule = subDays(firstEndSchedule, 1);
    await createSchedule({
      staff: newStaff._id.toString(),
      tag,
      start: secondStartSchedule,
      end: secondEndSchedule,
    });

    await addStaffToProduct({
      staff: newStaff,
      product: newProduct,
      tag,
    });

    const newStaff1 = await createStaff();

    const firstStartSchedule1 = setMinutes(new Date(), 0);
    const firstEndSchedule1 = addHours(setMinutes(new Date(), 0), 2);
    await createSchedule({
      staff: newStaff1._id.toString(),
      tag,
      start: firstStartSchedule1,
      end: firstEndSchedule1,
    });

    await addStaffToProduct({
      staff: newStaff1,
      product: newProduct,
      tag,
    });

    const query = {
      shop: global.shop,
      productId: newProductID,
      start: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    };

    const availabilityRangeByAll =
      await widgetController.availabilityRangeByAll({
        query,
      });

    expect(availabilityRangeByAll.length).toEqual(2);

    const first = availabilityRangeByAll[0];
    expect(first.hours.length).toEqual(2);

    let fullnames = first.hours.map((h) => h.staff.fullname);
    expect(fullnames).toEqual([newStaff.fullname, newStaff.fullname]);

    const last = availabilityRangeByAll[1];
    expect(last.hours.length).toEqual(4);

    fullnames = last.hours.map((h) => h.staff.fullname);
    expect(fullnames).toEqual([
      newStaff.fullname,
      newStaff.fullname,
      newStaff1.fullname,
      newStaff1.fullname,
    ]);
  });
});
