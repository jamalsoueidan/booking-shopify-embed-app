/// <reference path="../@types/index.d.ts" />
/// <reference path="../@types/settings.d.ts" />
/// <reference path="../@types/staff.d.ts" />
/// <reference path="../@types/product.d.ts" />
/// <reference path="../@types/collection.d.ts" />
/// <reference path="../@types/customer.d.ts" />
/// <reference path="../@types/booking.d.ts" />
/// <reference path="../@types/notification.d.ts" />

declare module '*';
interface Response {
  json: () => {};
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

interface SchedulesApi extends Api {
  payload: Schedule[];
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
