import EmptyStaff from "@components/staff/EmptyStaff";
import Metadata from "@components/staff/Metadata";
import { Staff } from "@jamalsoueidan/bsb.mongodb.types";
import { usePosition } from "@jamalsoueidan/bsf.bsf-pkg";
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
  const { select } = usePosition();

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
            {fullname} <Metadata active={active} />
          </Text>
          <div>
            {select(position)}
            <br />
          </div>
        </ResourceItem>
      );
    },
    [navigate, select],
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
