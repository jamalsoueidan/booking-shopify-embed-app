enum SettingLanguage {
  en = "en",
  da = "da",
}

interface Setting {
  _id: string;
  shop: string;
  language: SettingLanguage | string;
  timeZone: string;
  status: boolean;
}

interface SettingBodyUpdate extends Partial<Omit<Setting, "_id" | "shop">> {}
