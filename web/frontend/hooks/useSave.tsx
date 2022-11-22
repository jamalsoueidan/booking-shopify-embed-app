import { ContextualSaveBar } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';

export default ({ submitting, dirty, submit, reset }: any) => {
  const { t } = useTranslation('common');

  const primaryAction = {
    content: t('buttons.save'),
    loading: submitting,
    disabled: !dirty,
    onAction: submit,
  };

  const secondaryActions = {
    content: t('buttons.discard'),
    onAction: reset,
    disabled: !dirty,
  };

  const saveBar = dirty && (
    <ContextualSaveBar
      message={t('unsaved')}
      saveAction={primaryAction}
      discardAction={secondaryActions}
    />
  );

  return {
    primaryAction,
    secondaryActions,
    saveBar,
  };
};
