import { faker } from "@faker-js/faker";
import {
  CustomerModel,
  ProductModel,
  ProductServiceUpdate,
  ScheduleServiceCreate,
  StaffServiceCreate,
  Tag,
} from "@jamalsoueidan/pkg.bsb";
import { addHours } from "date-fns";

declare var global: Record<string, string>;

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
  return StaffServiceCreate({
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
  productId = 0,
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
  tag: Tag;
  start?: Date;
  end?: Date;
}
export const createSchedule = async ({
  staff,
  tag,
  start = new Date(),
  end = addHours(new Date(), 5),
}: CreateSchedule) => {
  return await ScheduleServiceCreate(
    {
      staff,
      shop: global.shop,
    },
    {
      tag,
      start,
      end,
    },
  );
};

export const createStaffWithSchedule = async ({ tag }: any) => {
  const staff = await createStaff();
  const schedule = await createSchedule({
    staff: staff._id,
    tag,
  });
  return { staff, schedule };
};

export const createStaffAndUpdateProduct = async ({ product, tag }: any) => {
  const { staff, schedule } = await createStaffWithSchedule({ tag });
  const updateProduct = await ProductServiceUpdate(
    {
      shop: global.shop,
      id: product._id,
    },
    {
      staff: [{ _id: staff._id, tag }],
    },
  );

  return { staff, updateProduct, schedule };
};
