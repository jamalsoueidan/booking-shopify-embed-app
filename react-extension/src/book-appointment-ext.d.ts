/// <reference path="../../web/@types/index.d.ts" />
/// <reference path="../../web/@types/settings.d.ts" />
/// <reference path="../../web/@types/staff.d.ts" />
/// <reference path="../../web/@types/schedule.d.ts" />
/// <reference path="../../web/@types/widget.d.ts" />

declare module "react-to-webcomponent";

interface ApplicationContext {
  api: string;
  productId: string;
  shop: string;
}

interface FormContext {
  staff?: WidgetStaff;
  schedule?: WidgetSchedule;
  hour?: WidgetHour;
}

interface AppProps {
  config: Config;
}

interface CustomForm {
  staff: Field<WidgetStaff | undefined>;
  schedule: Field<WidgetSchedule | undefined>;
  hour: Field<WidgetHour | undefined>;
}

interface FieldProps {
  fields: CustomForm;
}
