interface BookingModalChildProps {
  info: BookingAggreate;
  setPrimaryAction: (value: ComplexAction) => void;
  setSecondaryActions: (value: ComplexAction[]) => void;
}
