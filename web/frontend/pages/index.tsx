import { useNavigate } from '@shopify/app-bridge-react';

export default () => {
  const navigate = useNavigate();
  navigate(`/bookings`);
  return <></>;
};
