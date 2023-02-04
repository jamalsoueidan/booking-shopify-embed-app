import { IProductModel } from "@jamalsoueidan/bsb.bsb-pkg";
import { GetCartsByStaffReturn } from "@services/cart.service";
import {
  addMinutes,
  format,
  isBefore,
  isWithinInterval,
  subMinutes,
} from "date-fns";
import { GetByStaffAndTagReturn } from "../../database/services/schedule.service";

interface ScheduleReduceProduct
  extends Pick<IProductModel, "duration" | "buffertime"> {}

const scheduleReduce =
  (product: ScheduleReduceProduct) =>
  (
    previous: Array<WidgetSchedule>,
    current: GetByStaffAndTagReturn
  ): Array<WidgetSchedule> => {
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
        start: start.toISOString(),
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
): ((schedule: WidgetSchedule) => WidgetSchedule) => {
  const { start, end, staff } = book;
  return (schedule: WidgetSchedule): WidgetSchedule => {
    return {
      ...schedule,
      hours: schedule.hours.filter((hour) => {
        if (hour.staff._id.toString() !== staff.toString()) {
          return true;
        }

        if (
          isWithinInterval(addMinutes(start, 1), {
            start: new Date(hour.start),
            end: new Date(hour.end),
          })
        ) {
          return false;
        }

        if (
          isWithinInterval(subMinutes(end, 1), {
            start: new Date(hour.start),
            end: new Date(hour.end),
          })
        ) {
          return false;
        }

        return true;
      }),
    };
  };
};

const calculate = ({ schedules, bookings, carts, product }) => {
  let scheduleDates = schedules.reduce(scheduleReduce(product), []);

  bookings.forEach((book) => {
    scheduleDates = scheduleDates.map(
      scheduleCalculateBooking({
        end: book.end,
        start: book.start,
        staff: book.staff._id,
      })
    );
  });

  carts.forEach((cart) => {
    scheduleDates = scheduleDates.map(scheduleCalculateBooking(cart));
  });

  return scheduleDates;
};

export default { scheduleCalculateBooking, scheduleReduce, calculate };
