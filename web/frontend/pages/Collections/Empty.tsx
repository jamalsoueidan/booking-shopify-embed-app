import { useTranslation } from '@hooks';
import { useCollection, useCollectionCreate } from '@services';
import { ResourcePicker, useNavigate } from '@shopify/app-bridge-react';
import { Card, EmptyState, Page } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { create } = useCollectionCreate();
  const { t } = useTranslation('collections');

  const handleSelection = useCallback(
    (resources: Resources) => {
      const selections = resources.selection.map((s) => s.id);
      create({ selections });
      setOpen(false);
    },
    [create, setOpen]
  );

  const onCancel = useCallback(() => setOpen(false), []);

  const action = useMemo(
    () => ({
      content: t('empty.choose_collections'),
      onAction: () => setOpen(true),
    }),
    []
  );

  const { data } = useCollection();

  if (data?.length > 0) {
    navigate('/Collections/List');
    return <></>;
  }

  return (
    <Page title={t('title')}>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={handleSelection}
        onCancel={onCancel}
      />
      <Card sectioned>
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading={t('empty.title')}
          action={action}>
          <p>{t('empty.text')} 🚀</p>
        </EmptyState>
      </Card>
    </Page>
  );
};
