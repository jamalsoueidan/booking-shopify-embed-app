declare module '*';
interface Response {
  json: () => {};
}

interface Api {
  error: string;
  success: boolean;
}

interface StaffTag {
  _id: string;
  tag: string;
  fullname: string;
  avatar?: string;
  position?: string;
}

interface Product {
  _id: string;
  productId: string;
  collectionId: string;
  title: string;
  staff: Array<StaffTag>;
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
  avatar: string;
  position: string;
}

interface ProductStaff {
  _id: string;
  staff: string;
  tags: string;
  fullname: string;
}

interface ProductStaffToAdd extends Staff {
  tags: string[];
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
  anyAvailable: boolean;
  cancelled: boolean;
  orderId: number;
}

interface Notification {
  _id: string;
  orderId: number;
  lineItemId: number;
  message: string;
  receiver: string;
  scheduled: Date;
  shop: string;
  createdAt: Date;
  updatedAt: Date;
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

interface NotificationsApi extends Api {
  payload: Notification[];
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

interface ReturnApi<Payload = any> {
  success: boolean;
  error?: string;
  payload?: Payload;
}
