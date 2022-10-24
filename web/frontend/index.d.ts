interface Api {
  error: string;
  success: boolean;
}

interface Product {
  _id: string;
  productId: string;
  collectionId: string;
  title: string;
}

interface Collection {
  _id: string;
  collectionId: string;
  title: string;
  products: Array<Product>;
}

interface CollectionsApi extends Api {
  payload: Array<Collection>;
}

interface Resource {
  id: string;
}
interface Resources {
  id?: string;
  selection: Resource[];
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
