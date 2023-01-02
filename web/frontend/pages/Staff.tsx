import EmptyStaff from '@components/staff/EmptyStaff';
import Metadata from '@components/staff/Metadata';
import { usePositions } from '@hooks';
import { useStaff } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import {
  Avatar,
  Card,
  Page,
  ResourceItem,
  ResourceList,
  Text,
} from '@shopify/polaris';
import { useCallback, useMemo } from 'react';

export default () => {
  const navigate = useNavigate();
  const { data } = useStaff();
  const { select } = usePositions();

  const renderItems = useCallback(
    (item: Staff) => {
      const { _id, fullname, active, avatar, position } = item;
      const url = '/Staff/' + _id;
      const media = useMemo(
        () => <Avatar customer size="medium" name={fullname} source={avatar} />,
        [fullname, avatar]
      );

      return (
        <ResourceItem
          id={_id}
          url={url}
          media={media}
          accessibilityLabel={`View details for ${fullname}`}>
          <Text variant="headingSm" as="h6">
            {fullname} <Metadata active={active} />
          </Text>
          <div>
            {select(position)}
            <br />
          </div>
        </ResourceItem>
      );
    },
    [select]
  );

  return (
    <Page
      fullWidth
      title="Staff"
      primaryAction={{
        content: 'Add team member',
        onAction: () => navigate('/Staff/New'),
      }}>
      <Card>
        <ResourceList
          emptyState={<EmptyStaff />}
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={data || []}
          renderItem={renderItems}
        />
      </Card>
    </Page>
  );
};
