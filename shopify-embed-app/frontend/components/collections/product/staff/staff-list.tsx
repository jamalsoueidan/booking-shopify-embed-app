import { ProductServiceUpdateBodyStaffProperty } from "@jamalsoueidan/bsb.types";
import {
  HelperArray,
  usePosition,
  useTag,
  useTranslation,
} from "@jamalsoueidan/pkg.bsf";
import {
  Avatar,
  Button,
  ResourceItem,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { useCallback, useContext, useMemo } from "react";
import FormContext from "./form-context";
import { StaffEmptyState } from "./staff-empty";

interface StaffListProps {
  action: () => void;
}

export const StaffList = ({ action }: StaffListProps) => {
  const { t } = useTranslation({
    id: "collections-staff-list",
    locales: {
      da: {
        browse: "Vælge",
      },
      en: {
        browse: "Browse",
      },
    },
  });
  const { select: selectTag } = useTag();
  const { select: selectPosition } = usePosition();
  const { value } = useContext(FormContext);

  const renderItem = useCallback(
    (item: ProductServiceUpdateBodyStaffProperty) => {
      const { _id, fullname, avatar, position } = item;

      const media = (
        <Avatar customer size="medium" name={fullname} source={avatar} />
      );

      return (
        <ResourceItem id={_id} media={media} name={fullname} onClick={action}>
          <Text variant="bodyMd" fontWeight="bold" as="h3">
            {fullname}, {selectPosition(position)}
          </Text>
          <div>{selectTag(item.tag as any)}</div>
        </ResourceItem>
      );
    },
    [action, selectPosition, selectTag],
  );

  const items = useMemo(
    () => [...value].sort(HelperArray.soryTextBy("fullname") as any),
    [value],
  );

  return (
    <ResourceList
      emptyState={<StaffEmptyState action={action} />}
      items={items}
      alternateTool={<Button onClick={action}>{t("browse")}</Button>}
      renderItem={renderItem}
    />
  );
};
