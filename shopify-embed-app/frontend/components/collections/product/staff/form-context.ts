import { ProductServiceUpdateBodyStaffProperty } from "@jamalsoueidan/pkg.bsb-types";
import { DynamicList } from "@shopify/react-form/build/ts/hooks/list/dynamiclist";
import { createContext } from "react";

export default createContext<
  DynamicList<ProductServiceUpdateBodyStaffProperty>
>(null);
