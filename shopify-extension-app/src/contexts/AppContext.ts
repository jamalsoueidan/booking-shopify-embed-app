import { createContext } from "react";

export default createContext<ApplicationContext>({
  api: "",
  productId: "",
  shop: "",
});
