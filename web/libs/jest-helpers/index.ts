import { faker } from "@faker-js/faker";
import ProductModel from "@models/Product.model";
import ProductService from "@services/Product.service";
import ScheduleService from "@services/Schedule.service";
import StaffService from "@services/Staff.service";
import { addHours } from "date-fns";

export const createStaff = async () => {
  return await StaffService.create({
    shop: global.shop,
    fullname: faker.name.fullName(),
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
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });
};

export const createNewStaffAndAddToProductWithSchedule = async ({
  product,
  tag,
}) => {
  const staff = await createStaff();

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
