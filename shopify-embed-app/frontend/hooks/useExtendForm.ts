import { useSaveBar } from '@providers/saveBar';
import { Action } from '@shopify/polaris';
import {
  DynamicListBag,
  FieldBag,
  FormInput,
  FormWithDynamicLists,
  useForm,
} from '@shopify/react-form';
import { useEffect, useState } from 'react';

interface FormReturn<T extends FieldBag, D extends DynamicListBag>
  extends Partial<FormWithDynamicLists<T, D>> {
  isSubmitted: boolean;
  isValid: boolean;
  primaryAction?: Action;
}

interface FormProps<T extends FieldBag, D extends DynamicListBag>
  extends FormInput<T, D> {
  enableSaveBar?: boolean;
}

export const useExtendForm = <T extends FieldBag, D extends DynamicListBag>(
  form: FormProps<T, D>
): FormReturn<T, D> => {
  const saveBar = useSaveBar({ show: form.enableSaveBar !== false });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); //fix for useForm
  const [isValid, setIsValid] = useState<boolean>(false);
  const customForm = useForm({
    ...form,
    onSubmit: async (fieldValues) => {
      setIsSubmitted(true);
      setIsSubmitting(true);
      if (form.onSubmit) {
        const response = await form.onSubmit(fieldValues as any);
        setIsSubmitting(false);
        return response;
      }
      return { status: 'success' };
    },
    makeCleanAfterSubmit: true,
  });

  useEffect(() => {
    saveBar.setForm({ reset: customForm.reset, submit: customForm.submit });

    return () => {
      saveBar.setForm(null);
    };
  }, []);

  useEffect(() => {
    return () => {
      // case we redirect in onSubmit
      setIsSubmitting(false);
      saveBar.setForm({ dirty: false, submitting: false });
    };
  }, []);

  useEffect(() => {
    const isValidNew = isSubmitted && customForm.submitErrors.length === 0;
    if (isValidNew !== isValid) {
      setIsValid(isValidNew);
    }
  }, [isSubmitted, customForm.submitErrors]);

  useEffect(() => {
    saveBar.setForm({ dirty: customForm.dirty });
  }, [customForm.dirty]);

  useEffect(() => {
    saveBar.setForm({ submitting: isSubmitting });
  }, [isSubmitting]);

  return {
    isSubmitted,
    isValid,
    primaryAction: saveBar.contextualSaveBar?.saveAction,
    ...customForm,
  };
};
