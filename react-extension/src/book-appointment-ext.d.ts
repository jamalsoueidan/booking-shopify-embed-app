declare module "react-to-webcomponent";

interface ApplicationContext {
  api: string;
  productId: string;
  shop: string;
}

interface FormContext {
  staff?: Staff;
  schedule?: Schedule;
  hour?: Hour;
}

interface AppProps {
  config: Config;
}

interface Staff {
  fullname: string;
  staff: string;
  anyAvailable?: boolean;
}

interface Hour {
  start: string;
  end: string;
  staff: {
    _id: string;
    fullname: string;
  };
}
interface Schedule {
  date: string;
  hours: Hour[];
}

interface CustomForm {
  staff: Field<Staff | undefined>;
  schedule: Field<Schedule | undefined>;
  hour: Field<Hour | undefined>;
}

interface FieldProps {
  fields: CustomForm;
}
