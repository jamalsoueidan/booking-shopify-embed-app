import { MutableRefObject } from 'react';

export type setReset = () => void;
export type setSubmit = (event?: React.FormEvent) => void;

export interface SaveBarActions {
  setDirty: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setReset: (value: setReset) => void;
  setSubmit: (value: setSubmit) => void;
}

export interface SaveBarValues {
  dirty: boolean;
  submitting: boolean;
  reset?: MutableRefObject<setReset>;
  submit?: MutableRefObject<setSubmit>;
}

export interface SaveBarProps extends SaveBarActions, SaveBarValues {}
