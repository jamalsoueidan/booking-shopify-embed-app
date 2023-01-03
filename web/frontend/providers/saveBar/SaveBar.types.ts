import { ContextualSaveBarProps } from '@shopify/polaris';
import { FormEvent } from 'react';

export type setReset = () => void;
export type setSubmit = (event?: FormEvent<Element>) => Promise<void>;

export interface SaveBarActions {
  setContextualSaveBar: (value: ContextualSaveBarProps) => void;
  setForm: (value: Partial<ShowBarFormProps>) => void;
}

export interface ShowBarFormProps {
  dirty: boolean;
  submitting: boolean;
  reset?: setReset;
  submit?: setSubmit;
  show: boolean;
}

export interface SaveBarValues {
  form: ShowBarFormProps;
  contextualSaveBar: ContextualSaveBarProps;
}

export interface SaveBarProps extends SaveBarActions, SaveBarValues {
  contextualSaveBar: ContextualSaveBarProps;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseSaveBarProps {
  show: boolean;
}
