import { ProductServiceUpdateBodyStaffProperty } from "@jamalsoueidan/pkg.backend-types";
import { DynamicList } from "@shopify/react-form/build/ts/hooks/list/dynamiclist";
import { createContext } from "react";

export default createContext<
  DynamicList<ProductServiceUpdateBodyStaffProperty>
>(null);
