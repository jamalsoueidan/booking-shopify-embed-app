declare module "react-to-webcomponent";

interface Config {
  api: string;
  productId: string;
  shop: string;
}

interface AppProps {
  config: Config;
}
