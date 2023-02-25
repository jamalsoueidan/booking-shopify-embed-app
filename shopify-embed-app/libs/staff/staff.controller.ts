import {
  ControllerProps,
  ShopQuery,
  StaffBodyCreate,
  StaffBodyUpdate,
  StaffServiceCreate,
  StaffServiceFindAll,
  StaffServiceFindByIdAndUpdate,
  StaffServiceFindOne,
} from "@jamalsoueidan/pkg.bsb";

export const get = ({ query }: ControllerProps<ShopQuery>) => {
  const shop = query.shop;
  return StaffServiceFindAll({ shop });
};

export const create = ({
  query,
  body,
}: ControllerProps<ShopQuery, StaffBodyCreate>) => {
  const shop = query.shop;
  return StaffServiceCreate({ shop, ...body });
};

interface GetByIdQuery {
  id: string;
}

export const getById = ({ query }: ControllerProps<GetByIdQuery>) => {
  const { shop, id } = query;
  return StaffServiceFindOne({ _id: id, shop });
};

interface UpdateParams {
  id: string;
}

export const update = ({
  body,
  query,
}: ControllerProps<UpdateParams, StaffBodyUpdate>) => {
  const id = query.id;
  return StaffServiceFindByIdAndUpdate(id, body);
};
