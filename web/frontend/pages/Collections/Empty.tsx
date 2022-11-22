import { useCollectionCreate, useCollectionList } from '@services/collection';
import { ResourcePicker, useNavigate } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notFoundImage } from '../../assets';

export default () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { create } = useCollectionCreate();
  const { t } = useTranslation('collections');

  const handleSelection = async (resources: Resources) => {
    const ids = resources.selection.map((s) => s.id);
    await create(ids);
    setOpen(false);
  };

  const { data } = useCollectionList();

  if (data?.length > 0) {
    navigate('/Collections');
    return <></>;
  }

  return (
    <Page narrowWidth title={t('title')}>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        <EmptyState
          image={notFoundImage}
          heading={t('empty.title')}
          action={{
            content: t('empty.choose_collections'),
            onAction: () => setOpen(true),
          }}>
          <p>{t('empty.text')} 🚀</p>
        </EmptyState>
      </Layout>
    </Page>
  );
};
