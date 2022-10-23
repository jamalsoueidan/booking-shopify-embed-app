import { useNavigate } from "@shopify/app-bridge-react";
import { Layout, Page, Spinner } from "@shopify/polaris";
import { useState } from "react";
import useSWR from "swr";
import { useAuthenticatedFetch } from "../hooks";

export default () => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<StafferApi>("/api/admin/staff", (apiURL: string) =>
    fetch(apiURL).then((res) => res.json())
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
    navigate("/Staff/Empty");
    return <></>;
  }

  navigate("/Staff/List");
  return <></>;
};
