import { useSaveBar } from '@providers/saveBar';
import { Action } from '@shopify/polaris';
import {
  FieldBag,
  Form,
  FormWithoutDynamicListsInput,
  useForm,
} from '@shopify/react-form';
import { useEffect, useState } from 'react';

interface CustomForm<T extends FieldBag> extends Form<T> {
  isSubmitted: boolean;
  isValid: boolean;
  primaryAction?: Action;
}

export const useCustomForm = <T extends FieldBag>(
  form: FormWithoutDynamicListsInput<T>,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  isFullPage: boolean = true
): CustomForm<T> => {
  const saveBar = useSaveBar({ show: isFullPage });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const customForm = useForm({
    ...form,
    onSubmit: async (fieldValues) => {
      setIsSubmitted(true);
      if (form.onSubmit) {
        return form.onSubmit(fieldValues);
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
