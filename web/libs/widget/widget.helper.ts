import { BookingModel } from "../../database/models/booking";
import { ScheduleModel } from "../../database/models/schedule";
import { addMinutes, differenceInMinutes, format, isBefore } from "date-fns";
import { Types } from "mongoose";
import {
  ProductModel,
  ReturnGetProductWithSelectedStaffId,
} from "./../../database/models/product";

export interface ScheduleHour {
  start: Date;
  end: Date;
  staff: Types.ObjectId;
}

export interface ScheduleDate {
  date: string;
  hours: ScheduleHour[];
}

interface ScheduleReduceProduct
  extends Pick<ProductModel, "duration" | "buffertime"> {}

const scheduleReduce =
  (product: ScheduleReduceProduct) =>
  (
    previous: Array<ScheduleDate>,
    current: ScheduleModel
  ): Array<ScheduleDate> => {
    const end = new Date(current.end);
    const duration = product.duration || 60;
    const buffertime = product.buffertime || 0;

    // we push start time everytime
    let start = new Date(current.start);
    const date = format(start, "yyyy-MM-dd");

    let hours = previous.find((p) => p.date === date)?.hours || [];
    while (isBefore(start, end)) {
      hours.push({
        start: start,
        end: addMinutes(start, duration),
        staff: current.staff,
      });
      start = addMinutes(start, duration + buffertime);
    }
    previous.push({ date, hours });
    return previous;
  };

const scheduleCalculateBooking = (
  book: BookingModel
): ((schedule: ScheduleDate) => ScheduleDate) => {
  const { start, end, staff } = book;
  return (schedule: ScheduleDate): ScheduleDate => {
    return {
      ...schedule,
      hours: schedule.hours.filter((hour) => {
        if (hour.staff._id.toString() !== staff.toString()) {
          return true;
        }

        if (
          differenceInMinutes(start, hour.start) <= 0 &&
          differenceInMinutes(end, hour.start) >= 0
        ) {
          return false;
        }
        if (
          differenceInMinutes(start, hour.end) <= 0 &&
          differenceInMinutes(end, hour.end) >= 0
        ) {
          return false;
        }

        return true;
      }),
    };
  };
};

export default { scheduleCalculateBooking, scheduleReduce };