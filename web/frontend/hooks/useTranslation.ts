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

      let replacements = {} as { count: number };
      if (secondOptions?.count) {
        replacements = { count: secondOptions?.count.length };
        tKey += `.${replacements.count === 0 ? 'zero' : 'other'}`;
      }

      return i18n.translate(tKey, replacements);
    },
    []
  );
  return {
    t,
    i18n,
  };
};
