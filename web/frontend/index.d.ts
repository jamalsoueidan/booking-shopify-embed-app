/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../@types/index.d.ts" />
/// <reference path="../@types/settings.d.ts" />
/// <reference path="../@types/staff.d.ts" />
/// <reference path="../@types/product.d.ts" />
/// <reference path="../@types/collection.d.ts" />
/// <reference path="../@types/customer.d.ts" />
/// <reference path="../@types/booking.d.ts" />
/// <reference path="../@types/notification.d.ts" />
/// <reference path="../@types/schedule.d.ts" />
/// <reference path="../@types/widget.d.ts" />
/// <reference types="vite/client" />

declare module '*';
interface Response {
  json: () => void;
}

interface Resource {
  id: string;
}
interface Resources {
  id?: string;
  selection: Resource[];
}
