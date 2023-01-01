import { Toast, ToastProps } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from './Toast.context';

export const ToastProvider = ({ children }: any) => {
  const [toast, setToast] = useState<Partial<ToastProps>>();
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const show = useCallback((value: Partial<ToastProps>) => {
    setToast(value);
    setActive(true);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {active && (
        <Toast duration={3500} content="" onDismiss={toggleActive} {...toast} />
      )}
      {children}
    </ToastContext.Provider>
  );
};
