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

type ScheduleOrSchedules = ScheduleBody[] | ScheduleBody;

interface ScheduleCreateBody {
  staff: string;
  schedules: ScheduleOrSchedules;
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
