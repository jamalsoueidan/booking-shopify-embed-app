import { IProductModel } from "@models/product.model";
import { GetCartsByStaffReturn } from "@services/cart.service";
import {
  addMinutes,
  format,
  isBefore,
  isWithinInterval,
  subMinutes,
} from "date-fns";
import {
  GetByStaffAndTagReturn,
  GetByTagReturn,
} from "../../database/services/schedule.service";

export interface ScheduleHourStaff {
  _id: string;
  fullname: string;
}

export interface ScheduleHour {
  start: Date;
  end: Date;
  staff: ScheduleHourStaff;
}

export interface ScheduleDate {
  date: string;
  hours: ScheduleHour[];
}

interface ScheduleReduceProduct
  extends Pick<IProductModel, "duration" | "buffertime"> {}

const scheduleReduce =
  (product: ScheduleReduceProduct) =>
  (
    previous: Array<ScheduleDate>,
    current: GetByStaffAndTagReturn | GetByTagReturn
  ): Array<ScheduleDate> => {
    const scheduleEnd = new Date(current.end);
    const duration = product.duration || 60;
    const buffertime = product.buffertime || 0;

    // we push start time everytime
    let start = new Date(current.start);
    let end;

    const date = format(start, "yyyy-MM-dd");

    let previousHours = previous.find((p) => p.date === date);
    let hours = previousHours?.hours || [];

    //TODO: needs to create more hours
    while (
      isBefore(addMinutes(start, 1), scheduleEnd) &&
      isBefore(addMinutes(start, duration + buffertime), scheduleEnd)
    ) {
      end = addMinutes(start, duration + buffertime);
      hours.push({
        start: start,
        end,
        staff: current.staff,
      });

      start = addMinutes(start, 15);
    }

    if (!previousHours) {
      previous.push({ date, hours });
    }
    return previous;
  };

const scheduleCalculateBooking = (
  book: GetCartsByStaffReturn
): ((schedule: ScheduleDate) => ScheduleDate) => {
  const { start, end, staff } = book;
  return (schedule: ScheduleDate): ScheduleDate => {
    return {
      ...schedule,
      hours: schedule.hours.filter((hour) => {
        if (hour.staff._id.toString() !== staff.toString()) {
          return true;
        }

        if (isWithinInterval(addMinutes(start, 1), hour)) {
          return false;
        }

        if (isWithinInterval(subMinutes(end, 1), hour)) {
          return false;
        }

        return true;
      }),
    };
  };
};

export default { scheduleCalculateBooking, scheduleReduce };
