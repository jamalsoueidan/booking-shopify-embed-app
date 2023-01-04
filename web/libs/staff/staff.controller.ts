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

const create = ({
  query,
  body,
}: {
  query: CreateQuery;
  body: StaffBodyCreate;
}) => {
  const shop = query.shop;
  return StaffService.create({ shop, ...body });
};

interface GetByIdQuery {
  shop: string;
  id: string;
}

const getById = ({ query }: { query: GetByIdQuery }) => {
  const { shop, id } = query;
  return StaffService.findOne(id, { shop });
};

interface UpdateParams {
  id: string;
}

const update = ({
  body,
  query,
}: {
  body: StaffBodyUpdate;
  query: UpdateParams;
}) => {
  const id = query.id;
  return StaffService.findByIdAndUpdate(id, body);
};

export default { get, getById, update, create };
