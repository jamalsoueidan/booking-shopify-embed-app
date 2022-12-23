import { useTranslation } from '@hooks/useTranslation';
import { ContextualSaveBar } from '@shopify/polaris';
import { useContext } from 'react';
import { SaveBarContext } from './SaveBar.context';

export const SaveBarConsumer = () => {
  const { submitting, dirty, submit, reset } = useContext(SaveBarContext);

  const { t } = useTranslation('common');

  const primaryAction = {
    content: t('buttons.save'),
    loading: submitting,
    disabled: !dirty,
    onAction: submit.current,
  };

  const secondaryActions = {
    content: t('buttons.discard'),
    onAction: reset.current,
    disabled: !dirty,
  };

  return dirty ? (
    <ContextualSaveBar
      message={t('unsaved')}
      saveAction={primaryAction}
      discardAction={secondaryActions}
    />
  ) : null;
};
