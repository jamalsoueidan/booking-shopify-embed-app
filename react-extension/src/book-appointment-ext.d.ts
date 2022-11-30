declare module "react-to-webcomponent";

interface ApplicationContext {
  api: string;
  productId: string;
  shop: string;
}

interface FormContext {
  staff?: Staff;
  schedule?: Schedule;
}

interface AppProps {
  config: Config;
}

interface Staff {
  fullname: string;
  staff: string;
  tag: string;
  _id: string;
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
