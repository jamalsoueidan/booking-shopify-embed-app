import ModalConfirm from '@components/modals/ModalConfirm';
import { useTranslation } from '@hooks';
import { sortStrings } from '@libs/sortStrings';
import { useCollectionDestroy } from '@services';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  ResourceItem,
  ResourceList,
  Stack,
  Text,
  TextContainer,
} from '@shopify/polaris';
import { memo, useCallback, useMemo, useState } from 'react';
import MissingImage from '../MissingImage';

interface CollectionProps {
  collection: CollectionAggreate;
}

export default memo(({ collection }: CollectionProps) => {
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

  const renderItem = useCallback((item: Product<ProductStaffAggreate>) => {
    const { _id, title, active, imageUrl } = item;

    const status = active ? 'success' : 'critical';

    return (
      <ResourceItem
        id={_id}
        url={'/Collections/Product/' + _id}
        name={title}
        media={
          imageUrl ? (
            <Avatar customer size="large" source={`${imageUrl}&width=80`} />
          ) : (
            <MissingImage />
          )
        }>
        <Stack spacing="tight">
          <Text variant="bodyMd" fontWeight="bold" as="h3">
            {title}
          </Text>
          <Badge status={status}>{active ? 'Active' : 'Deactive'}</Badge>
        </Stack>

        <Box paddingBlockStart="2">
          <div>
            {t('staff', {
              count: item.staff,
            })}
          </div>

          {item.staff?.length > 0 && (
            <Box paddingBlockStart="2">
              <Stack spacing="extraTight">
                {item.staff.sort(sortStrings('fullname')).map((staff) => {
                  return (
                    <Avatar
                      key={staff._id}
                      customer
                      size="small"
                      name={staff.fullname}
                      source={staff.avatar}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
      </ResourceItem>
    );
  }, []);

  const products = useMemo(
    () => [...collection.products].sort(sortStrings('title')),
    [collection.products]
  );

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
          <ResourceList
            resourceName={{ singular: 'product', plural: 'products' }}
            items={products}
            renderItem={renderItem}
          />
        </Card>
      </TextContainer>
      <br />
      <br />
    </>
  );
});
