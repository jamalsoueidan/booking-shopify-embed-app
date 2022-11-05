import { Props } from "../../@types";
import Setting, { SettingModel } from "../../database/models/setting";

export enum ControllerMethods {
  get = "get",
  create = "create",
}

interface GetQuery extends Pick<SettingModel, "shop"> {}

const get = async ({ query }: Props<GetQuery>) => {
  const shop = query.shop;
  return await Setting.findOne({ shop });
};

interface CreateQuery extends Pick<SettingModel, "shop"> {}

const create = async ({ query, body }: Props<CreateQuery>) => {
  const shop = query.shop;

  return await Setting.findOneAndUpdate({ shop }, body, {
    upsert: true,
    new: true,
  });
};

export default { get, create };
