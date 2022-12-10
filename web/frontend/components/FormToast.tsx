import { Toast } from '@shopify/polaris';
import { useCallback, useState } from 'react';

interface FormToastProps {
  message: string;
  error?: boolean;
}

export default ({ message, error }: FormToastProps) => {
  const [showToast, setShowToast] = useState(true);
  const toggleActive = useCallback(() => {
    setShowToast(() => false);
  }, []);

  return (
    <>
      {showToast && (
        <Toast
          content={message}
          duration={2000}
          onDismiss={toggleActive}
          error={error}
        />
      )}
    </>
  );
};
