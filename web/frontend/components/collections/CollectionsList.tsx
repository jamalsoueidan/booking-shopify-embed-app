import { useTranslation } from '@hooks';
import { useCollectionDestroy } from '@services';
import {
  Button,
  Card,
  Icon,
  ResourceItem,
  ResourceList,
  Text,
  TextContainer,
} from '@shopify/polaris';
import { CancelMinor, TickMinor } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';
import ModalConfirm from '../modals/ModalConfirm.js';

interface CollectionListProps {
  collection: CollectionAggreate;
}

export default ({ collection }: CollectionListProps) => {
  const [modalConfirm, setModalConfirm] = useState<JSX.Element>();
  const { destroy } = useCollectionDestroy({ collectionId: collection._id });
  const { t } = useTranslation('collections');

  const setActive = useCallback(async (shouldDestroy: boolean) => {
    shouldDestroy && destroy();
    setModalConfirm(null);
  }, []);

  const removeCollection = useCallback(() => {
    setModalConfirm(
      <ModalConfirm active={true} setActive={setActive}></ModalConfirm>
    );
  }, []);

  const renderItem = useCallback((item: Product) => {
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
            count: item.staff,
          })}
        </Text>
      </ResourceItem>
    );
  }, []);
  return (
    <>
      {modalConfirm}
      <TextContainer>
        <Text variant="headingLg" as="h1">
          {collection.title}{' '}
          <Button plain destructive onClick={removeCollection}>
            {t('remove_collection')}
          </Button>
        </Text>
        <Card>
          <ResourceList items={collection.products} renderItem={renderItem} />
        </Card>
      </TextContainer>
      <br />
      <br />
    </>
  );
};
