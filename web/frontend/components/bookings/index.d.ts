interface BookingModalChildProps {
  info: Booking;
  setPrimaryAction: (value: ComplexAction) => void;
  setSecondaryActions: (value: ComplexAction[]) => void;
}
