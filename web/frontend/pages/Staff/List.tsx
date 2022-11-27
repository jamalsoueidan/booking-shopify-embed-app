import LoadingPage from '@components/LoadingPage';
import Metadata from '@components/staff/Metadata';
import { useStaffList } from '@services/staff';
import { useNavigate } from '@shopify/app-bridge-react';
import {
  Avatar,
  Card,
  Page,
  ResourceItem,
  ResourceList,
  Text,
} from '@shopify/polaris';

export default () => {
  const navigate = useNavigate();
  const { data } = useStaffList();

  if (!data) {
    return <LoadingPage />;
  }

  const renderItems = (item: Staff) => {
    const { _id, fullname, email, phone, active } = item;
    const url = '/Staff/' + _id;
    const media = <Avatar customer size="medium" name={fullname} />;

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
          {email}
          <br />
          {phone}
        </div>
      </ResourceItem>
    );
  };

  return (
    <Page
      title="Staff"
      primaryAction={{
        content: 'Add team member',
        onAction: () => navigate('/Staff/New'),
      }}>
      <Card>
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={data}
          renderItem={renderItems}
        />
      </Card>
    </Page>
  );
};
