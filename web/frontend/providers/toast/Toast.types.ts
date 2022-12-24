import { ToastProps } from '@shopify/polaris';

export interface ToastContextProps {
  show: (value: Partial<ToastProps>) => void;
}
