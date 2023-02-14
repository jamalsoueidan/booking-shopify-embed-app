import { EmptyStaff } from "@components/staff/empty-staff";
import { MetaData } from "@components/staff/meta-data";
import { Staff } from "@jamalsoueidan/bsb.types";
import { usePosition } from "@jamalsoueidan/pkg.bsf";
import { useStaff } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import {
  Avatar,
  Card,
  Page,
  ResourceItem,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { useCallback } from "react";

export default () => {
  const navigate = useNavigate();
  const { data } = useStaff();
  const { selectPosition } = usePosition();

  const renderItems = useCallback(
    (item: Staff) => {
      const { _id, fullname, active, avatar, position } = item;
      const media = (
        <Avatar customer size="medium" name={fullname} source={avatar} />
      );

      return (
        <ResourceItem
          id={_id}
          onClick={() => navigate("/staff/" + _id)}
          media={media}
          accessibilityLabel={`View details for ${fullname}`}>
          <Text variant="headingSm" as="h6">
            {fullname} <MetaData active={active} />
          </Text>
          <div>
            {selectPosition(position)}
            <br />
          </div>
        </ResourceItem>
      );
    },
    [navigate, selectPosition],
  );

  return (
    <Page
      fullWidth
      title="Staff"
      primaryAction={{
        content: "Add team member",
        url: "/staff/new",
      }}>
      <Card>
        <ResourceList
          emptyState={<EmptyStaff />}
          resourceName={{ plural: "customers", singular: "customer" }}
          items={data || []}
          renderItem={renderItems}
        />
      </Card>
    </Page>
  );
};
