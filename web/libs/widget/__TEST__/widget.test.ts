import {
  addStaffToProduct,
  createNewStaffAndAddToProductWithSchedule,
  createProduct,
  createSchedule,
  createStaff,
} from "@libs/jest-helpers";
import { IProductModel } from "@models/product.model";
import { IStaffModel } from "@models/staff.model";
import StaffService from "@services/staff.service";
import {
  addDays,
  addHours,
  format,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
  subHours,
} from "date-fns";
import mongoose, { Document } from "mongoose";

import { faker } from "@faker-js/faker";
import widgetController from "../widget.controller";

const productId = faker.random.numeric(10);
const shopifyProductId = `gid://shopify/Product/${productId}`;

interface CustomProductModel extends IProductModel, Document {}
interface ICustomStaffModel extends IStaffModel, Document {}
let product: CustomProductModel;
let staff: ICustomStaffModel;
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
    staff = await StaffService.findByIdAndUpdate(staff._id, { active: false });

    const query = {
      shop: global.shop,
      productId,
    };

    const allStaff = await widgetController.staff({ query });
    expect(allStaff.length).toEqual(1);
  });

  it("Should return staff hours on a specified day", async () => {
    const newStaff = await createStaff();

    const start = setHours(setMinutes(new Date(), 0), 10);
    const end = addHours(start, 4);
    await createSchedule({
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
    expect(day.hours.length).toEqual(4);
    const first = day.hours[0];
    expect(first.start).toEqual(setSeconds(setMilliseconds(start, 0), 0));
    const last = day.hours[day.hours.length - 1];
    expect(last.end).toEqual(setSeconds(setMilliseconds(end, 0), 0));
  });

  it("Should return staff hours to a specified day range", async () => {
    const newProductID = faker.random.numeric(10);
    const newProduct = await createProduct({
      shopifyProductId: `gid://shopify/Product/${newProductID}`,
      duration: 60,
      buffertime: 0,
    });

    const newStaff = await createStaff();
    const firstStartSchedule = setHours(setMinutes(new Date(), 0), 10);
    const firstEndSchedule = addHours(firstStartSchedule, 4);
    await createSchedule({
      staff: newStaff._id.toString(),
      tag,
      start: firstStartSchedule,
      end: firstEndSchedule,
    });

    const secondStartSchedule = addDays(firstStartSchedule, 1);
    const secondEndSchedule = addDays(firstEndSchedule, 1);
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

    const query = {
      shop: global.shop,
      productId: newProductID,
      start: format(firstStartSchedule, "yyyy-MM-dd"),
      end: format(secondEndSchedule, "yyyy-MM-dd"),
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
      setSeconds(setMilliseconds(firstStartSchedule, 0), 0)
    );
    let lastHour = first.hours[first.hours.length - 1];
    expect(lastHour.end).toEqual(
      setSeconds(setMilliseconds(firstEndSchedule, 0), 0)
    );

    const last = availabilityRangeByStaff[1];
    expect(last.hours.length).toEqual(4);

    firstHour = last.hours[0];
    expect(firstHour.start).toEqual(
      setSeconds(setMilliseconds(secondStartSchedule, 0), 0)
    );
    lastHour = last.hours[last.hours.length - 1];
    expect(lastHour.end).toEqual(
      setSeconds(setMilliseconds(secondEndSchedule, 0), 0)
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
    expect(first.hours.length).toEqual(4);

    let fullnames = first.hours.map((h) => h.staff.fullname);
    //expect(fullnames).toEqual([newStaff.fullname, newStaff.fullname]);

    const last = availabilityRangeByAll[1];
    expect(last.hours.length).toEqual(2);

    fullnames = last.hours.map((h) => h.staff.fullname);
    /*expect(fullnames).toEqual([
      newStaff.fullname,
      newStaff.fullname,
      newStaff1.fullname,
      newStaff1.fullname,
    ]);*/
  });
});
