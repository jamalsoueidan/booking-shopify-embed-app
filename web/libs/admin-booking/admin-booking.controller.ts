import BookingService from "@services/Booking.service";

export enum ControllerMethods {
  get = "get",
}

const get = async ({ query }) => {
  return await BookingService.getBookings(query);
};

export default { get };
