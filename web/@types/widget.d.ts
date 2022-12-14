interface WidgetStaffQuery {
  productId: number;
}

interface WidgetDateQuery {
  staff: string;
  productId: number;
  start: string;
  end: string;
}

interface WidgetStaff {
  tag: string;
  fullname: string;
  staff: string;
  avatar?: string;
  position?: string;
}

interface WidgetHours {
  start: string;
  end: string;
  staff: {
    _id: string;
    fullname: string;
  };
}

interface WidgetSchedule {
  date: string;
  hours: WidgetHours[];
}
