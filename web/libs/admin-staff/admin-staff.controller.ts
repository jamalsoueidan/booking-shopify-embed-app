import { IStaffModel } from "@models/staff.model";
import StaffService from "@services/staff.service";

export enum ControllerMethods {
  get = "get",
  create = "create",
  getById = "getById",
  update = "update",
}

interface GetQuery {
  shop: string;
}

const get = ({ query }: { query: GetQuery }) => {
  const shop = query.shop;
  return StaffService.find(shop);
};

interface CreateQuery {
  shop: string;
}

const create = async ({
  query,
  body,
}: {
  query: CreateQuery;
  body: StaffBodyUpdate;
}) => {
  const shop = query.shop;
  return await StaffService.create({ shop, ...body });
};

interface GetByIdQuery {
  shop: string;
  id: string;
}

const getById = async ({ query }: { query: GetByIdQuery }) => {
  const { shop, id } = query;
  return await StaffService.findOne(id, { shop });
};

interface UpdateParams {
  id: string;
}

const update = async ({
  body,
  query,
}: {
  body: StaffBodyUpdate;
  query: UpdateParams;
}) => {
  const id = query.id;
  return await StaffService.findByIdAndUpdate(id, body);
};

export default { get, getById, update, create };
