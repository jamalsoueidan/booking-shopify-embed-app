import { EmptyStaff } from "@components/staff/empty-staff";
import { MetaData } from "@components/staff/meta-data";
import { Staff } from "@jamalsoueidan/pkg.backend-types";
import {
  usePosition,
  useStaff,
  useTranslation,
} from "@jamalsoueidan/pkg.frontend";
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
  const { t } = useTranslation({ id: "staff", locales });
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
      title={t("title")}
      primaryAction={{
        content: t("add"),
        url: "/staff/new",
      }}>
      <Card>
        <ResourceList
          emptyState={<EmptyStaff />}
          resourceName={{
            plural: t("resource.plural"),
            singular: t("resource.singular"),
          }}
          items={data || []}
          renderItem={renderItems}
        />
      </Card>
    </Page>
  );
};

const locales = {
  da: {
    add: "Tilføj ny medarbejder",
    resource: {
      plural: "medarbejder",
      singular: "medarbejder",
    },
    title: "Medarbejder ",
  },
  en: {
    add: "Add staff member",
    resource: {
      plural: "customers",
      singular: "customer",
    },
    title: "Staff",
  },
};
