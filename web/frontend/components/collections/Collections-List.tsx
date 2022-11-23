import { useCollectionDestroy } from '@services/collection';
import {
  Card,
  Icon,
  List,
  ResourceItem,
  ResourceList,
  Text,
} from '@shopify/polaris';
import { CancelMinor, TickMinor } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalConfirm from '../modals/ModalConfirm.js';

export default ({ collection }: { collection: Collection }) => {
  const [modalConfirm, setModalConfirm] = useState<any>();
  const { destroy } = useCollectionDestroy({ collectionId: collection._id });
  const { t } = useTranslation('collections');

  const setActive = useCallback(async (shouldDestroy: boolean) => {
    if (shouldDestroy) {
      await destroy();
    }
    setModalConfirm(null);
  }, []);

  const removeCollection = useCallback(() => {
    setModalConfirm(
      <ModalConfirm active={true} setActive={setActive}></ModalConfirm>
    );
  }, []);

  return (
    <>
      {modalConfirm}
      <Card
        key={collection._id}
        title={collection.title}
        actions={[
          {
            content: t('remove_collection'),
            onAction: removeCollection,
          },
        ]}>
        <ResourceList
          items={collection.products}
          renderItem={(item) => {
            const { _id, title, active } = item;

            const status = active ? 'success' : 'critical';
            const icon = active ? TickMinor : CancelMinor;

            return (
              <ResourceItem
                id={_id}
                url={'/Collections/Product/' + _id}
                media={<Icon source={icon} color={status} />}
                verticalAlignment="center">
                <Text variant="headingSm" as="h6">
                  {title}
                </Text>
                <Text variant="bodySm" as="p">
                  {t('staff', {
                    count: item.staff.length,
                    context: item.staff.length,
                  })}
                </Text>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </>
  );
};
