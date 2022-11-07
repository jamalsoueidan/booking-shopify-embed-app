import ProductModel, { IProductModel } from "@models/product.model";
import mongoose, { Document } from "mongoose";

import { IStaffModel } from "@models/staff.model";
import ScheduleService from "@services/schedule.service";
import StaffService from "@services/staff.service";
import { addHours, subHours } from "date-fns";
import productController from "../admin-product.controller";
import { createSchedule } from "@libs/test-helpers";

const productId = "123456789";
const shopifyProductId = `gid://shopify/Product/${productId}`;

interface ICustomProductModel extends IProductModel, Document {}
interface ICustomStaffModel extends IStaffModel, Document {}

let product: ICustomProductModel;
let staff1: ICustomStaffModel;
let staff2: ICustomStaffModel;
let staff3: ICustomStaffModel;

const tag = "testerne";

describe("admin-product controller", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);

    // prepare a product
    product = await ProductModel.create({
      shop: global.shop,
      collectionId: "anything",
      productId: shopifyProductId,
      title: "Makeup",
    });

    // prepare a product
    staff1 = await StaffService.create({
      shop: global.shop,
      fullname: "anders",
      email: "jamasdu@aeidan.com",
      phone: "+4531317411",
    });

    await createSchedule({
      tag,
      start: new Date(),
      end: addHours(new Date(), 5),
      staff: staff1._id,
    });

    staff2 = await StaffService.create({
      shop: global.shop,
      fullname: "morten",
      email: "jamasd@uaeidan.com",
      phone: "+4531317412",
    });

    await createSchedule({
      tag,
      start: subHours(new Date(), 3),
      end: addHours(new Date(), 2),
      staff: staff2._id,
    });

    staff3 = await StaffService.create({
      shop: global.shop,
      fullname: "claus",
      email: "jama@sduaeidan.com",
      phone: "+4531317413",
    });

    await createSchedule({
      tag,
      start: subHours(new Date(), 5),
      end: addHours(new Date(), 5),
      staff: staff3._id,
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
  it("Should find by id", async () => {
    const query = {
      shop: global.shop,
      id: product._id.toString(),
    };

    const findProduct = await productController.getById({ query });

    expect(findProduct.productId).toEqual(shopifyProductId);
  });

  it("Should update properties by id", async () => {
    const query = {
      shop: global.shop,
      id: product._id.toString(),
    };

    const duration = 50;
    const buffertime = 100;
    const updateProduct = await productController.update({
      query,
      body: {
        duration,
        buffertime,
      },
    });

    expect(updateProduct.duration).toEqual(duration);
    expect(updateProduct.buffertime).toEqual(buffertime);
  });

  it("Should get staff empty first time", async () => {
    const query = {
      shop: global.shop,
      id: product._id.toString(),
    };

    const staff = await productController.getStaff({
      query,
    });

    expect(staff.length).toEqual(0);
  });

  it("Should be able to add staff, and cannot add same staff twice", async () => {
    const query = {
      shop: global.shop,
      id: product._id.toString(),
    };

    const staffToAdd = await productController.getStaffToAdd({
      query,
    });

    expect(staffToAdd.length).toEqual(3);

    let pickStaff = staffToAdd[0];

    let body = {
      tag: pickStaff.tags[0],
      staff: pickStaff._id.toString(),
    };

    let updatedProduct: IProductModel;
    updatedProduct = await productController.addStaff({ query, body }); //same staff

    expect(updatedProduct.staff.length).toEqual(1);

    expect(JSON.parse(JSON.stringify(updatedProduct.staff))).toContainEqual(
      expect.objectContaining({
        ...body,
      })
    );

    updatedProduct = await productController.addStaff({ query, body }); //same staff
    expect(updatedProduct.staff.length).toEqual(1);
  });

  it("Should be able to add other staff", async () => {
    const query = {
      shop: global.shop,
      id: product._id.toString(),
    };

    const staffToAdd = await productController.getStaffToAdd({
      query,
    });

    expect(staffToAdd.length).toEqual(2);

    let pickStaff = staffToAdd[0];

    const body = {
      tag: pickStaff.tags[0],
      staff: pickStaff._id.toString(),
    };

    const updatedProduct = await productController.addStaff({
      query,
      body,
    });

    expect(updatedProduct.staff.length).toEqual(2);

    expect(JSON.parse(JSON.stringify(updatedProduct.staff))).toContainEqual(
      expect.objectContaining({
        ...body,
      })
    );
  });

  it("Should be able to remove staff", async () => {
    const query = {
      shop: global.shop,
      id: product._id.toString(),
    };

    let staff = await productController.getStaff({
      query,
    });

    expect(staff.length).toEqual(2);

    await productController.removeStaff({
      query: {
        ...query,
        staffId: staff[0]._id.toString(),
      },
    });

    let staffRemoved = await productController.getStaff({
      query,
    });

    expect(JSON.parse(JSON.stringify(staffRemoved))).not.toContainEqual(
      expect.objectContaining({
        ...staff[0],
      })
    );

    expect(staffRemoved.length).toEqual(1);
  });
});
