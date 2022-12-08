import { IStaffModel } from "@models/Staff.model";
import StaffService from "@services/Staff.service";

export enum ControllerMethods {
  get = "get",
  create = "create",
  getById = "getById",
  update = "update",
}

interface GetQuery extends Pick<IStaffModel, "shop"> {}

const get = async ({ query }: { query: GetQuery }) => {
  const shop = query.shop;
  return await StaffService.find(shop);
};

interface CreateQuery extends Pick<IStaffModel, "shop"> {}
interface CreateBody extends Partial<IStaffModel> {}

const create = async ({
  query,
  body,
}: {
  query: CreateQuery;
  body: CreateBody;
}) => {
  const shop = query.shop;
  return await StaffService.create({ shop, ...body });
};

interface GetByIdQuery extends Pick<IStaffModel, "shop"> {
  staff: string;
}

const getById = async ({ query }: { query: GetByIdQuery }) => {
  const { shop, staff } = query;
  return await StaffService.findOne(staff, { shop });
};

interface UpdateParams {
  staff: string;
}

const update = async ({
  body,
  query,
}: {
  body: Partial<IStaffModel>;
  query: UpdateParams;
}) => {
  const staff = query.staff;
  return await StaffService.findByIdAndUpdate(staff, body);
};

export default { get, getById, update, create };
