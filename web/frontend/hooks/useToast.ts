import { useAppBridge } from '@shopify/app-bridge-react';
import { Toast } from '@shopify/app-bridge/actions';
import { useCallback } from 'react';
import { type Toast as ToastProps } from '@shopify/app-bridge/actions/Toast';

interface UseToastProps
  extends Pick<ToastProps, 'message'>,
    Partial<Pick<ToastProps, 'isError'>> {}

export const useToast = () => {
  const app = useAppBridge();

  const show = useCallback((options: UseToastProps) => {
    const toastOptions = {
      duration: 2000,
      isError: false,
      ...options,
    };
    Toast.create(app, toastOptions).dispatch(Toast.Action.SHOW);
  }, []);

  return {
    show,
  };
};
