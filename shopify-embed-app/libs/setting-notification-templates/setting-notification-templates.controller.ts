import {
  ControllerProps,
  NotificationTemplate,
  NotificationTemplateModel,
  ShopQuery,
} from "@jamalsoueidan/bsb.bsb-pkg";

interface GetQuery extends Pick<NotificationTemplate, "shop" | "language"> {}

export const get = ({ query }: ControllerProps<GetQuery>) => {
  const { shop, language } = query;
  return NotificationTemplateModel.find({ shop, language });
};

interface CreateBody extends Array<NotificationTemplate> {}

export const update = async ({
  query,
  body,
}: ControllerProps<ShopQuery, CreateBody>) => {
  const shop = query.shop;

  const updateMany = body.map((n) => ({
    updateOne: {
      filter: { _id: n._id, shop, name: n.name, language: n.language },
      update: { message: n.message },
    },
  }));

  return NotificationTemplateModel.bulkWrite(updateMany);
};
