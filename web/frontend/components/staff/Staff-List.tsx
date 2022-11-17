import { useNavigate } from '@shopify/app-bridge-react';
import {
  Avatar,
  Card,
  Page,
  ResourceItem,
  ResourceList,
  TextStyle,
} from '@shopify/polaris';
import { useStaffList } from '../../services/staff';
import Metadata from './Metadata';

export default () => {
  const navigate = useNavigate();
  const { data } = useStaffList();

  if (!data) {
    return <>Loading</>;
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
        <h3>
          <TextStyle variation="strong">
            {fullname} <Metadata active={active} />
          </TextStyle>
        </h3>
        <div>
          {email}
          {phone}
        </div>
      </ResourceItem>
    );
  };

  return (
    <Page
      narrowWidth
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
