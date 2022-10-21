import { useNavigate } from "@shopify/app-bridge-react";
import { Layout, Page, Spinner } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import Staff from "../components/staff";
import { useAuthenticatedFetch } from "../hooks";

export default () => {
  const [loading, setLoading] = useState(false);
  const [staffer, setStaffer] = useState<Array<Staff>>([]);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/staff");
    const staff: Staffer | null = await response.json();
    setStaffer(staff.payload || []);
    setLoading(false);
  }, []);

  const updateStaffer = useCallback(
    (additionalCollections: Array<Staff>) => {
      var mergeUnique = staffer.concat(
        additionalCollections.filter(
          ({ _id }) => !staffer.find((f) => f._id == _id)
        )
      );
      setStaffer(mergeUnique);
    },
    [staffer]
  );

  const removeStaff = useCallback(
    async (staff: Staff) => {
      const response = await fetch(`/api/admin/staff/${staff._id}`, {
        method: "DELETE",
        body: JSON.stringify({ active: false }),
        headers: { "Content-Type": "application/json" },
      });
      setStaffer(staffer.filter((c) => c._id !== staff._id));
    },
    [staffer]
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Page>
        <Layout>
          <Spinner accessibilityLabel="Spinner" size="large" />
        </Layout>
      </Page>
    );
  }

  if (staffer?.length === 0) {
    navigate("/Staff/Empty");
    return <></>;
  }

  return <Staff.List></Staff.List>;
};
