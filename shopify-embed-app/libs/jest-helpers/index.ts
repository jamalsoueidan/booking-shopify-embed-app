import { faker } from "@faker-js/faker";
import { CustomerModel, ProductModel } from "@jamalsoueidan/bsb.bsb-pkg";
import ProductService from "@services/product.service";
import ScheduleService from "@services/schedule.service";
import StaffService from "@services/staff.service";
import { addHours } from "date-fns";

export const createCustomer = () => {
  const customer = new CustomerModel({
    customerId: parseInt(faker.random.numeric(10)),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: "+4531317411",
    shop: global.shop,
  });
  return customer.save();
};

export const createStaff = () => {
  return StaffService.create({
    shop: global.shop,
    fullname: faker.name.fullName(),
    email: faker.internet.email(),
    phone: "+4531317411",
    avatar: "http://",
    position: "2",
    postal: 8000,
    address: "asdiojdsajioadsoji",
    active: true,
    group: "all",
  });
};

export const createProduct = ({
  productId,
  duration = 45,
  buffertime = 15,
}) => {
  return ProductModel.create({
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

export const createStaffWithSchedule = async ({ tag }) => {
  const staff = await createStaff();
  const schedule = await createSchedule({
    staff: staff._id,
    tag,
  });
  return { staff, schedule };
};

export const createStaffAndUpdateProduct = async ({ product, tag }) => {
  const { staff, schedule } = await createStaffWithSchedule({ tag });
  const updateProduct = await ProductService.update({
    query: {
      shop: global.shop,
      id: product._id,
    },
    body: {
      staff: [{ _id: staff._id, tag }],
    },
  });

  return { staff, updateProduct, schedule };
};
