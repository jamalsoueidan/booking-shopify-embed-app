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
    context.setContextualSaveBar({
      saveAction: {
        content: t('buttons.save'),
        loading: context.submitting && context.dirty,
        disabled: !context.dirty,
        onAction: () => context.submit.current(),
      },
      discardAction: {
        content: t('buttons.discard'),
        onAction: () => context.reset.current(),
      },
      message: t('unsaved'),
    });
  }, [
    context.submitting,
    context.dirty,
    context.submit,
    context.reset,
    context.show,
    t,
  ]);

  useEffect(() => {
    context.setShow(show);
  }, [show]);

  return {
    ...context,
  };
};
