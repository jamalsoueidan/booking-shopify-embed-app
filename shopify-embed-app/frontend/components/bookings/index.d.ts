interface BookingModalProps {
  info: BookingAggreate;
}

interface BookingModalProductChildProps extends BookingModalProps {
  toggle: () => void;
}
