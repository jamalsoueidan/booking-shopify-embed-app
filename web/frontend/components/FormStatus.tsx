import { Banner, Toast } from '@shopify/polaris';
import { FormError } from '@shopify/react-form';
import { useCallback, useEffect, useState } from 'react';

interface FormStatusProps {
  errors: FormError[];
  success: boolean;
  showErrors?: boolean;
}

export default ({ errors, success, showErrors = true }: FormStatusProps) => {
  const [startFetching, setStartFetching] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toggleActive = useCallback(() => {
    setShowToast(() => false);
  }, []);

  useEffect(() => {
    if (success) {
      setStartFetching(true);
    }
  }, [success]);

  useEffect(() => {
    let timer1: any;
    if (startFetching && errors.length === 0 && !success) {
      setShowToast(true);
      timer1 = setTimeout(() => {
        setStartFetching(() => false);
        setShowToast(() => false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer1);
    };
  }, [success, startFetching]);

  if (showToast) {
    return (
      <Toast content="Changes saved" duration={2000} onDismiss={toggleActive} />
    );
  }

  if (errors.length > 0 && showErrors) {
    return (
      <Banner status="critical">
        <p>Errors</p>
        <ul>
          {errors.map(({ message }) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </Banner>
    );
  }

  return <></>;
};
