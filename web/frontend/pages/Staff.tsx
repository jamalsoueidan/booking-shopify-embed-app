import { useNavigate } from '@shopify/app-bridge-react';
import { Layout, Page, Spinner } from '@shopify/polaris';
import StaffList from '@components/staff/Staff-List';
import { useStaffList } from '@services/staff';

export default () => {
  const { data } = useStaffList();

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

  if (data?.length === 0) {
    navigate('/Staff/Empty');
    return <></>;
  }

  return <StaffList></StaffList>;
};
