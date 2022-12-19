import { useCollectionCreate, useCollectionList } from '@services/collection';
import { ResourcePicker, useNavigate } from '@shopify/app-bridge-react';
import { Card, EmptyState, Page } from '@shopify/polaris';
import { useState } from 'react';
import { useTranslation } from '@hooks';

export default () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { create } = useCollectionCreate();
  const { t } = useTranslation('collections');

  const handleSelection = async (resources: Resources) => {
    const selections = resources.selection.map((s) => s.id);
    await create({ selections });
    setOpen(false);
  };

  const { data } = useCollectionList();

  if (data?.length > 0) {
    navigate('/Collections/List');
    return <></>;
  }

  return (
    <Page title={t('title')}>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Card sectioned>
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading={t('empty.title')}
          action={{
            content: t('empty.choose_collections'),
            onAction: () => setOpen(true),
          }}>
          <p>{t('empty.text')} 🚀</p>
        </EmptyState>
      </Card>
    </Page>
  );
};
