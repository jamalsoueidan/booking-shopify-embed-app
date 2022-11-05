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
interface CreateBody extends Partial<Staff.StaffModel> {}

const create = async ({ query, body }: Props<CreateQuery, CreateBody>) => {
  const shop = query.shop;
  return await Staff.create({ shop, ...body });
};

interface GetByIdQuery extends Pick<Staff.StaffModel, "shop"> {}
interface GetByIdParams {
  staff: string;
}

const getById = async ({
  query,
  params,
}: {
  query: GetByIdQuery;
  params: GetByIdParams;
}) => {
  const shop = query.shop;
  const staff = params.staff;
  return await Staff.findOne(staff, { shop });
};

interface UpdateParams {
  staff: string;
}

const update = async ({
  body,
  params,
}: {
  body: Partial<Staff.StaffModel>;
  params: UpdateParams;
}) => {
  const staff = params.staff;
  return await Staff.findByIdAndUpdate(staff, body);
};

export default { get, getById, update, create };
