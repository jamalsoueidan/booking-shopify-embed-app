import { faker } from "@faker-js/faker";
import ProductModel from "@models/product.model";
import ProductService from "@services/product.service";
import ScheduleService from "@services/schedule.service";
import StaffService from "@services/staff.service";
import { addHours } from "date-fns";

export const createStaff = async (number = "0") => {
  return await StaffService.create({
    shop: global.shop,
    fullname: faker.name.fullName() + number,
    email: faker.internet.email(),
    phone: "+4531317411",
  });
};

export const createProduct = async ({
  productId,
  duration = 45,
  buffertime = 15,
}) => {
  return await ProductModel.create({
    shop: global.shop,
    collectionId: parseInt(faker.random.numeric(10)),
    productId,
    title: faker.company.name(),
    duration,
    buffertime,
  });
};

interface CreateSchedule {
  staff: string;
  tag: string;
  start?: Date;
  end?: Date;
}
export const createSchedule = async ({
  staff,
  tag,
  start = new Date(),
  end = addHours(new Date(), 5),
}: CreateSchedule) => {
  return await ScheduleService.create({
    staff,
    shop: global.shop,
    schedules: {
      tag,
      start,
      end,
    },
  });
};

export const createNewStaffAndAddToProductWithSchedule = async ({
  product,
  tag,
}) => {
  const staff = await createStaff("createNewStaff");

  const updateProduct = await ProductService.addStaff({
    id: product._id.toString(),
    shop: global.shop,
    staff: staff._id.toString(),
    tag,
  });

  const schedule = await createSchedule({
    staff: staff._id.toString(),
    tag,
  });

  return { staff, updateProduct, schedule };
};

/**
 * @param {string}  staff - staff model
 * @param {string=} product - product model
 */
export const addStaffToProduct = async ({ staff, product, tag }) => {
  const updateProduct = await ProductService.addStaff({
    id: product._id.toString(),
    shop: global.shop,
    staff: staff._id.toString(),
    tag: tag,
  });

  return { updateProduct };
};
