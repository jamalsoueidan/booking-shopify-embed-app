import usePositions from '@components/usePositions';
import useTagOptions from '@components/useTagOptions';
import {
  Avatar,
  Button,
  EmptyState,
  ResourceItem,
  ResourceList,
  Text,
} from '@shopify/polaris';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import FormContext from './FormContext';

interface StaffListProps {
  action: () => void;
}

export default ({ action }: StaffListProps) => {
  const { t } = useTranslation('collections', { keyPrefix: 'product.staff' });
  const { select: selectTag } = useTagOptions();
  const { select: selectPosition } = usePositions();
  const { value } = useContext(FormContext);

  return (
    <ResourceList
      emptyState={<StaffEmptyState action={action}></StaffEmptyState>}
      items={value.sort((a, b) => (a.fullname > b.fullname ? 1 : -1))}
      alternateTool={<Button onClick={action}>{t('browse')}</Button>}
      renderItem={(item, _, index) => {
        const { _id, fullname, avatar, position } = item;

        const media = (
          <Avatar customer size="medium" name={fullname} source={avatar} />
        );

        return (
          <ResourceItem id={_id} media={media} name={fullname} onClick={action}>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {fullname}, {selectPosition(position)}
            </Text>
            <div>{selectTag(item.tag)}</div>
          </ResourceItem>
        );
      }}
    />
  );
};

interface StaffEmptyStateProps {
  action: () => void;
}

const StaffEmptyState = ({ action }: StaffEmptyStateProps) => {
  const { t } = useTranslation('collections', {
    keyPrefix: 'product.staff.empty',
  });

  return (
    <div style={{ maxHeight: '270px' }}>
      <EmptyState
        heading={t('title')}
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
        imageContained={true}
        fullWidth
        action={{ content: t('browse'), onAction: action }}></EmptyState>
    </div>
  );
};