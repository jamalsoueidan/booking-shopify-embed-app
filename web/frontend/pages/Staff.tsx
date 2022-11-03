import { useNavigate } from '@shopify/app-bridge-react';
import { Layout, Page, Spinner } from '@shopify/polaris';
import useSWR from 'swr';
import StaffList from '../components/staff/Staff-List';
import { useAuthenticatedFetch } from '../hooks';

export default () => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<StafferApi>('/api/admin/staff', (apiURL: string) =>
    fetch(apiURL).then((res: Response) => res.json())
  );

  const navigate = useNavigate();

  if (!data) {
    return (
      <Page>
        <Layout>
          <Spinner accessibilityLabel="Spinner" size="large" />
        </Layout>
      </Page>
    );
  }

  if (data?.payload?.length === 0) {
    navigate('/Staff/Empty');
    return <></>;
  }

  return <StaffList></StaffList>;
};
