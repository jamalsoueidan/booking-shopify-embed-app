declare module '*';
interface Response {
  json: () => {};
}

interface Api {
  error: string;
  success: boolean;
}

interface StaffTag extends Staff {
  tags: string;
  staff: string;
}

interface Product {
  _id: string;
  productId: string;
  collectionId: string;
  title: string;
  staff: Array<ProductStaff>;
  buffertime: number;
  duration: number;
  active: boolean;
}

interface Collection {
  _id: string;
  collectionId: string;
  title: string;
  products: Array<Product>;
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

interface ProductStaff {
  _id: string;
  staff: string;
  tags: string;
  fullname: string;
}

interface ProductStaffToAdd {
  _id: string;
  staff: string;
  tags: string[];
  fullname: string;
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

interface Booking {
  _id: string;
  shop: string;
  staff: Staff;
  start: Date;
  end: Date;
  productId: string;
  product: Product;
  //for full-calendar
  title: string;
  anyStaff: boolean;
  cancelled: boolean;
  orderId: number;
}
interface SchedulesApi extends Api {
  payload: Schedule[];
}

interface CollectionsApi extends Api {
  payload: Array<Collection>;
}

interface ProductApi extends Api {
  payload: Product;
}

interface StafferApi extends Api {
  payload: Array<Staff>;
}

interface ProductStaffApi extends Api {
  payload: Array<ProductStaff>;
}

interface ProductStaffToAddApi extends Api {
  payload: Array<ProductStaffToAdd>;
}

interface StaffApi extends Api {
  payload: Staff;
}

interface BookingsApi {
  payload: Array<Booking>;
}

interface Setting {
  language: string;
  timeZone: string;
  status?: boolean;
}

interface SettingApi {
  payload: Setting;
}
