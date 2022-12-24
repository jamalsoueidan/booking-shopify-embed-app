import { ContextualSaveBarProps } from '@shopify/polaris';
import { MutableRefObject } from 'react';

export type setReset = () => void;
export type setSubmit = (event?: React.FormEvent) => void;

export interface SaveBarActions {
  setDirty: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setReset: (value: setReset) => void;
  setSubmit: (value: setSubmit) => void;
  setContextualSaveBar: (value: ContextualSaveBarProps) => void;
  setShow: (value: boolean) => void;
}

export interface SaveBarValues {
  dirty: boolean;
  submitting: boolean;
  reset?: MutableRefObject<setReset>;
  submit?: MutableRefObject<setSubmit>;
  contextualSaveBar: ContextualSaveBarProps;
  show: boolean;
}

export interface SaveBarProps extends SaveBarActions, SaveBarValues {
  contextualSaveBar: ContextualSaveBarProps;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseSaveBarProps extends Pick<SaveBarValues, 'show'> {}
