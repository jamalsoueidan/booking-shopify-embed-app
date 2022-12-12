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

interface Customer {
  _id: string;
  customerId: number;
  shop: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: any;
}

interface Booking {
  _id: string;
  shop: string;
  staff: Staff;
  start: Date;
  end: Date;
  productId: number;
  product: Product;
  title: string;
  anyAvailable: boolean;
  cancelled: boolean;
  orderId: number;
  isEdit: boolean;
  lineItemId: number;
  lineItemTotal: number;
  customerId: number;
  customer: Customer;
  timeZone: string;
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
  isStaff: boolean;
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

interface WidgetStaff {
  tag: string;
  fullname: string;
  staff: string;
  avatar?: string;
  position?: string;
}

interface WidgetStaffApi extends Api {
  payload: Array<WidgetStaff>;
}

interface WidgetDateHour {
  start: string;
  end: string;
  staff: {
    _id: string;
    fullname: string;
  };
}
interface WidgetDateSchedule {
  date: string;
  hours: WidgetDateHour[];
}

interface WidgetDateApi extends Api {
  payload: Array<WidgetDateSchedule>;
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

interface BookingsGetApi {
  payload: Booking;
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
