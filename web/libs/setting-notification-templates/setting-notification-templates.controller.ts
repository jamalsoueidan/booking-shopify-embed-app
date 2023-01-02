import NotificationTemplateModel from "@models/notification-template.model";

export enum ControllerMethods {
  get = "get",
  update = "update",
}

interface GetQuery extends Pick<NotificationTemplate, "shop"> {}

const get = ({ query }: { query: GetQuery }) => {
  const shop = query.shop;
  return NotificationTemplateModel.find({ shop });
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
      filter: { _id: n._id, shop, name: n.name },
      update: { message: n.message },
    },
  }));

  return NotificationTemplateModel.bulkWrite(updateMany);
};

export default { get, update };
