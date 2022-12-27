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
  const [isValid, setIsValid] = useState<boolean>(false);
  const customForm = useForm({
    ...form,
    onSubmit: (fieldValues) => {
      setIsSubmitted(true);
      if (form.onSubmit) {
        return form.onSubmit(fieldValues as any);
      }
    },
    makeCleanAfterSubmit: true,
  });

  useEffect(() => {
    saveBar.setReset(customForm.reset);
    saveBar.setSubmit(customForm.submit);

    return () => {
      saveBar.setDirty(false);
    };
  }, []);

  useEffect(() => {
    const isValidNew = isSubmitted && customForm.submitErrors.length === 0;
    if (isValidNew !== isValid) {
      setIsValid(isValidNew);
    }
  }, [isSubmitted, customForm.submitErrors]);

  useEffect(() => {
    if (saveBar.dirty !== customForm.dirty) {
      saveBar.setDirty(customForm.dirty);
    }
  }, [customForm.dirty]);

  useEffect(() => {
    if (saveBar.submitting !== customForm.submitting) {
      saveBar.setSubmitting(customForm.submitting);
    }
  }, [customForm.submitting]);

  return {
    isSubmitted,
    isValid,
    primaryAction: saveBar.contextualSaveBar?.saveAction,
    ...customForm,
  };
};
