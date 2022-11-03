import { useNavigate } from '@shopify/app-bridge-react';
import {
  Avatar,
  Card,
  Page,
  ResourceItem,
  ResourceList,
  TextStyle,
} from '@shopify/polaris';
import useSWR from 'swr';
import Metadata from './Metadata';
import { useAuthenticatedFetch } from '../../hooks';

export default () => {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<StafferApi>('/api/admin/staff', (apiURL: string) =>
    fetch(apiURL).then((res: Response) => res.json())
  );

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
          items={data?.payload}
          renderItem={renderItems}
        />
      </Card>
    </Page>
  );
};
