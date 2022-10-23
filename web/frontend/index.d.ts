interface Api {
  error: string;
  success: boolean;
}

interface Product {
  id: string;
  title: string;
}

interface Products {
  nodes: Array<Product>;
}

interface Collection {
  id: string;
  title: string;
  metafields: object;
  products: Products;
}

interface CollectionsApi extends Api {
  payload: Array<Collection>;
}

interface Resources {
  id?: string;
  selection: Product[];
}

interface Staff {
  _id: string;
  shop: string;
  fullname: string;
  email: string;
  phone: string;
  active: boolean;
}

interface StafferApi extends Api {
  payload: Array<Staff>;
}

interface StaffApi extends Api {
  payload: Staff;
}

interface Schedule {
  _id: string;
  staff: string;
  start: Date | string;
  end: Date | string;
  tag: string;
  groupId: string;
  available: boolean;
}
interface SchedulesApi extends Api {
  payload: Schedule[];
}
