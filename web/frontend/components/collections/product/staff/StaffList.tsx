import TagOptions from '@components/staff/TagOptions';
import {
  Avatar,
  Button,
  ComplexAction,
  EmptyState,
  ResourceItem,
  ResourceList,
  Text,
} from '@shopify/polaris';
import { useContext } from 'react';
import FormContext from './FormContext';

interface StaffListProps {
  action: () => void;
}

export default ({ action }: StaffListProps) => {
  const { value, removeItem } = useContext(FormContext);

  return (
    <ResourceList
      showHeader
      totalItemsCount={value.length}
      emptyState={<StaffEmptyState action={action}></StaffEmptyState>}
      resourceName={{ singular: 'customer', plural: 'customers' }}
      items={value.sort((a, b) => (a.fullname > b.fullname ? 1 : -1))}
      alternateTool={<Button onClick={action}>Browse</Button>}
      renderItem={(item, _, index) => {
        const { _id, fullname } = item;

        return (
          <ResourceItem
            id={_id}
            media={<Avatar customer />}
            name={fullname}
            onClick={() => removeItem(index)}>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {fullname}
            </Text>
            <div>{TagOptions.find((t) => t.value === item.tag)?.label}</div>
          </ResourceItem>
        );
      }}
    />
  );
};

interface StaffEmptyStateProps {
  action: () => void;
}

const StaffEmptyState = ({ action }: StaffEmptyStateProps) => (
  <div style={{ maxHeight: '270px' }}>
    <EmptyState
      heading="Der er ikke tilføjet brugere endnu."
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
      imageContained={true}
      fullWidth
      action={{ content: 'Browse', onAction: action }}></EmptyState>
  </div>
);
