import { NotificationTemplateModel } from "@jamalsoueidan/bsb.bsb-pkg";

export enum ControllerMethods {
  get = "get",
  update = "update",
}

interface GetQuery extends Pick<NotificationTemplate, "shop" | "language"> {}

const get = ({ query }: { query: GetQuery }) => {
  const { shop, language } = query;
  return NotificationTemplateModel.find({ shop, language });
};

interface CreateQuery {
  shop: string;
}

interface CreateBody extends Array<NotificationTemplate> {}

const update = async ({
  query,
  body,
}: {
  query: CreateQuery;
  body: CreateBody;
}) => {
  const shop = query.shop;

  const updateMany = body.map((n) => ({
    updateOne: {
      filter: { _id: n._id, shop, name: n.name, language: n.language },
      update: { message: n.message },
    },
  }));

  return NotificationTemplateModel.bulkWrite(updateMany);
};

export default { get, update };
