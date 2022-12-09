import SettingModel, { ISettingModel } from "@models/setting.models";

export enum ControllerMethods {
  get = "get",
  create = "create",
}

interface GetQuery extends Pick<ISettingModel, "shop"> {}

const get = async ({ query }: { query: GetQuery }) => {
  const shop = query.shop;
  return await SettingModel.findOne({ shop });
};

interface CreateQuery extends Pick<ISettingModel, "shop"> {}
interface CreateBody extends Partial<ISettingModel> {}

const create = async ({
  query,
  body,
}: {
  query: CreateQuery;
  body: CreateBody;
}) => {
  const shop = query.shop;

  return await SettingModel.findOneAndUpdate({ shop }, body, {
    upsert: true,
    new: true,
  });
};

export default { get, create };
