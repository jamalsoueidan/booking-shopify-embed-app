import { useCollection } from '@services';

import CollectionList from '@components/collections/CollectionList';
import ResourcePicker from '@components/collections/ResourcePicker';
import { useTranslation } from '@hooks/useTranslation';
import { useNavigate } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import { Suspense, useState } from 'react';
import LoadingSpinner from '@components/LoadingSpinner';

export default () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data } = useCollection();
  const { t } = useTranslation('collections');

  if (data?.length === 0) {
    navigate('/collections/empty');
    return <></>;
  }

  return (
    <Page
      fullWidth
      title={t('title')}
      primaryAction={{
        content: t('add_collection'),
        onAction: () => setOpen(true),
      }}>
      <ResourcePicker open={open} setOpen={setOpen} />
      <Suspense fallback={<LoadingSpinner />}>
        <CollectionList collections={data} />
      </Suspense>
    </Page>
  );
};
