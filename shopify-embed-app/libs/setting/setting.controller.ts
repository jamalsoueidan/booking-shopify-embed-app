import {
  ControllerProps,
  SettingModel,
  ShopQuery,
} from "@jamalsoueidan/bsb.bsb-pkg";

export const get = ({ query }: ControllerProps<ShopQuery>) => {
  const shop = query.shop;
  return SettingModel.findOne({ shop });
};

interface CreateBody extends SettingBodyUpdate {}

export const create = async ({
  query,
  body,
}: ControllerProps<ShopQuery, CreateBody>): Promise<Setting> => {
  const shop = query.shop;

  return await SettingModel.findOneAndUpdate({ shop }, body, {
    upsert: true,
    new: true,
  });
};
