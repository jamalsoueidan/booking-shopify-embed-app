import { useNavigate } from '@shopify/app-bridge-react';
export default () => {
  const test: TestBook = {
    test: 'a',
  };
  console.log(test);
  const navigate = useNavigate();
  navigate(`/bookings`);
  return <></>;
};
