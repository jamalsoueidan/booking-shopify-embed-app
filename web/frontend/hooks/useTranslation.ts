import { useI18n } from '@shopify/react-i18n';
import { useCallback } from 'react';

interface UseTranslationOptions {
  keyPrefix?: string;
}

interface UseTranslationInnerOptions extends UseTranslationOptions {
  count?: Array<any>;
}

export const useTranslation = (
  root: string,
  options?: UseTranslationOptions
) => {
  const [i18n] = useI18n();

  const t = useCallback(
    (key: string, secondOptions?: UseTranslationInnerOptions) => {
      let tKey = root;
      if (secondOptions?.keyPrefix || options?.keyPrefix) {
        tKey += `.${secondOptions?.keyPrefix || options?.keyPrefix}`;
      }
      tKey += `.${key}`;

      const tOptions = {} as any;
      if (secondOptions?.count) {
        tOptions.count = secondOptions?.count.length;
      }

      return i18n.translate(tKey, tOptions);
    },
    []
  );

  return {
    t,
  };
};
