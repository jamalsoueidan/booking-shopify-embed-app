import { useSaveBar } from '@providers/saveBar';
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
}

export const useCustomForm = <T extends FieldBag>(
  form: FormWithoutDynamicListsInput<T>,
  isModal = true
): CustomForm<T> => {
  const saveBar = useSaveBar();
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
  });

  useEffect(() => {
    const isValidNew = isSubmitted && customForm.submitErrors.length === 0;
    if (isValidNew !== isValid) {
      setIsValid(isValidNew);
    }
  }, [isSubmitted, customForm.submitErrors]);

  useEffect(() => {
    saveBar.setReset(customForm.reset);
    saveBar.setSubmit(customForm.submit);

    return () => {
      saveBar.setDirty(false);
    };
  }, []);

  useEffect(() => {
    if (saveBar.dirty !== customForm.dirty && isModal) {
      saveBar.setDirty(customForm.dirty);
    }
  }, [customForm.dirty, isModal]);

  useEffect(() => {
    if (saveBar.submitting !== customForm.submitting) {
      saveBar.setSubmitting(customForm.submitting);
    }
  }, [customForm.submitting]);

  return {
    isSubmitted,
    isValid,
    ...customForm,
  };
};
