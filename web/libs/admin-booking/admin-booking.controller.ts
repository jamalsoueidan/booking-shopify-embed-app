import BookingService from "@services/booking.service";

export enum ControllerMethods {
  get = "get",
}

const get = async ({ query }) => {
  return await BookingService.getBookings(query);
};

export default { get };
