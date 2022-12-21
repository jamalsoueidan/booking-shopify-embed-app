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
  form: FormWithoutDynamicListsInput<T>
): CustomForm<T> => {
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
    setIsValid(isSubmitted && customForm.submitErrors.length === 0);
  }, [isSubmitted, customForm.submitErrors]);

  return {
    isSubmitted,
    isValid,
    ...customForm,
  };
};
