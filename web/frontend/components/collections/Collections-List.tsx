import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { Card, Icon, ResourceItem, ResourceList, Text } from '@shopify/polaris';
import { ProductsMajor } from '@shopify/polaris-icons';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import ModalConfirm from '../modals/ModalConfirm.js';

export default ({ collection }: { collection: Collection }) => {
  const [modalConfirm, setModalConfirm] = useState<any>();

  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const removeCollection = (collection: any) => {
    const setActive = async (value: boolean) => {
      if (value) {
        await fetch(`/api/admin/collections/${collection._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      mutate('/api/admin/collections');
      setModalConfirm(null);
    };

    setModalConfirm(
      <ModalConfirm active={true} setActive={setActive}></ModalConfirm>
    );
  };

  return (
    <>
      {modalConfirm}
      <Card
        key={collection._id}
        title={collection.title}
        actions={[
          {
            content: 'Remove',
            onAction: () => {
              removeCollection(collection);
            },
          },
        ]}>
        <ResourceList
          resourceName={{ singular: 'product', plural: 'products' }}
          items={collection.products}
          renderItem={(item) => {
            const { _id, title, active } = item;

            const status = active ? 'success' : 'critical';

            return (
              <ResourceItem
                id={_id}
                url={'/Collections/Product/' + _id}
                accessibilityLabel={`View details for ${title}`}
                media={<Icon source={ProductsMajor} color={status} />}
                verticalAlignment="center">
                <Text variant="headingSm" as="h6">
                  {title}
                </Text>
                <Text variant="bodySm" as="p">
                  {item.staff.length} staff added.
                </Text>
              </ResourceItem>
            );
          }}
          showHeader
          totalItemsCount={collection.products.length}
        />
      </Card>
    </>
  );
};
