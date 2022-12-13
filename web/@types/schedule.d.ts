interface Schedule {
  _id: string;
  staff: string;
  groupId?: string;
  start: Date;
  end: Date;
  tag: string;
  shop: string;
}

interface ScheduleBody extends Omit<Schedule, "shop" | "_id" | "staff"> {
  start: string;
  end: string;
}

type Schedules = ScheduleBody[] | ScheduleBody;

interface ScheduleCreateBody {
  staff: string;
  schedules: Schedules;
}

interface ScheduleQuery {
  staff: string;
  start: string;
  end: string;
}

interface ScheduleUpdateOrDestroyQuery {
  staff: string;
  schedule: string;
}
