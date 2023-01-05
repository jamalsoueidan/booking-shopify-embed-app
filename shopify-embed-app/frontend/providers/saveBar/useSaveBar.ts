import { useTranslation } from '@hooks/useTranslation';
import { useContext, useEffect } from 'react';
import { SaveBarContext } from './SaveBar.context';
import { SaveBarProps, UseSaveBarProps } from './SaveBar.types';

export const useSaveBar = ({ show }: UseSaveBarProps) => {
  const context = useContext<SaveBarProps>(SaveBarContext);
  if (context === undefined) {
    throw new Error('useSaveBar must be used within a SaveBarProvider');
  }

  const { t } = useTranslation('common');

  useEffect(() => {
    const form = context.form;
    if (form) {
      context.setContextualSaveBar({
        saveAction: {
          content: t('buttons.save'),
          loading: form.submitting,
          disabled: !form.dirty,
          onAction: () => form.submit(),
        },
        discardAction: {
          content: t('buttons.discard'),
          onAction: () => form.reset(),
        },
        message: t('unsaved'),
      });
    }
  }, [context.form]);

  useEffect(() => {
    context.setForm({ show });
  }, [show]);

  return {
    ...context,
  };
};
