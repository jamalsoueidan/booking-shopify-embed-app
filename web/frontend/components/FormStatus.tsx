import { Banner, Toast } from '@shopify/polaris';
import { FormError } from '@shopify/react-form';
import { useCallback, useEffect, useState } from 'react';
import { useTimeout } from 'usehooks-ts';

interface FormStatusProps {
  errors: FormError[];
  success: boolean;
}

export default ({ errors, success }: FormStatusProps) => {
  const [startFetching, setStartFetching] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toggleActive = useCallback(() => {
    setShowToast((showToast) => false);
  }, []);

  useEffect(() => {
    if (success) {
      setStartFetching(true);
    }
  }, [success]);

  useEffect(() => {
    if (startFetching && errors.length === 0 && !success) {
      setShowToast(true);
      setTimeout(() => {
        setStartFetching((value) => false);
        setShowToast((value) => false);
      }, 2000);
    }
  }, [success, startFetching]);

  if (showToast) {
    return (
      <Toast content="Changes saved" duration={2000} onDismiss={toggleActive} />
    );
  }

  if (errors.length > 0) {
    return (
      <Banner status="critical">
        <p>Errors</p>
        <ul>
          {errors.map(({ message }, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </Banner>
    );
  }

  return <></>;
};
