/// <reference path="../@types/index.d.ts" />
/// <reference path="../@types/settings.d.ts" />
/// <reference path="../@types/staff.d.ts" />
/// <reference path="../@types/product.d.ts" />
/// <reference path="../@types/collection.d.ts" />

declare module '*';
interface Response {
  json: () => {};
}

interface Api {
  error: string;
  success: boolean;
}

interface Resource {
  id: string;
}
interface Resources {
  id?: string;
  selection: Resource[];
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

interface NotificationsApi extends Api {
  payload: Notification[];
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

interface BookingsApi {
  payload: Array<Booking>;
}

interface BookingsGetApi {
  payload: Booking;
}

interface ReturnApi<Payload = any> {
  success: boolean;
  error?: string;
  payload?: Payload;
}
