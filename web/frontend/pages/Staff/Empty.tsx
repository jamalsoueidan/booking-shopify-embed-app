import { useNavigate } from "@shopify/app-bridge-react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { notFoundImage } from "../../assets";

export default ({}) => {
  const navigate = useNavigate();
  const props = { onAction: () => navigate("/Staff/New") };

  return (
    <Page
      narrowWidth
      title="Staff"
      primaryAction={{ content: "Add team member", ...props }}
    >
      <Layout>
        <EmptyState
          image={notFoundImage}
          heading="Team up and do even more!"
          action={{
            content: "Add team member",
            ...props,
          }}
        >
          <p>
            Add new team member. Then you'll be able to manage member profiles,
            working hours and who's doing what service.
          </p>
        </EmptyState>
      </Layout>
    </Page>
  );
};
