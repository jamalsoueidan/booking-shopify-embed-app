import { useTranslation } from '@hooks';
import { Card, EmptyState } from '@shopify/polaris';
import { useState } from 'react';
import ResourcePicker from './ResourcePicker';

export default () => {
  const { t } = useTranslation('staff', { keyPrefix: 'empty' });
  const [open, setOpen] = useState(false);
  const props = { onAction: () => setOpen(true) };

  return (
    <Card sectioned>
      <EmptyState
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        heading={t('heading')}
        action={{
          content: t('add'),
          ...props,
        }}>
        <p>{t('text')}</p>
      </EmptyState>
      <ResourcePicker open={open} setOpen={setOpen} />
    </Card>
  );
};
