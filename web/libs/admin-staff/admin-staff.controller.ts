import { Props } from "../../@types";
import * as Staff from "../../database/models/staff";

export enum ControllerMethods {
  get = "get",
  create = "create",
  getById = "getById",
  update = "update",
}

interface GetQuery extends Pick<Staff.StaffModel, "shop"> {}

const get = async ({ query }: Props<GetQuery>) => {
  const shop = query.shop;
  return await Staff.find(shop);
};

interface CreateQuery extends Pick<Staff.StaffModel, "shop"> {}

const create = async ({ query, body }: Props<CreateQuery>) => {
  const shop = query.shop;

  return await Staff.create({ shop, ...body });
};

interface GetByIdQuery extends Pick<Staff.StaffModel, "shop"> {}
interface GetByIdParams {
  staff: string;
}

const getById = async ({
  query,
  body,
  params,
}: Props<GetByIdQuery, any, GetByIdParams>) => {
  const shop = query;
  const { staff } = params;

  return await Staff.findOne(staff, { shop });
};

interface UpdateParams {
  staff: string;
}

const update = async ({
  query,
  body,
  params,
}: Props<any, Staff.StaffModel, UpdateParams>) => {
  const { staff } = params;

  return await Staff.findByIdAndUpdate(staff, body);
};

export default { get, getById, update, create };
