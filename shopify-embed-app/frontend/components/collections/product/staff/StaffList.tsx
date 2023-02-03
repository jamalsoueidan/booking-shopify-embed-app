import { usePositions, useTagOptions, useTranslation } from "@hooks";
import { ProductStaffAggreate } from "@jamalsoueidan/bsb.mongodb.types";
import {
  Avatar,
  Button,
  EmptyState,
  ResourceItem,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { useCallback, useContext } from "react";
import FormContext from "./FormContext";

interface StaffListProps {
  action: () => void;
}

export default ({ action }: StaffListProps) => {
  const { t } = useTranslation("collections", { keyPrefix: "product.staff" });
  const { select: selectTag } = useTagOptions();
  const { select: selectPosition } = usePositions();
  const { value } = useContext(FormContext);

  const renderItem = useCallback(
    (item: ProductStaffAggreate) => {
      const { _id, fullname, avatar, position } = item;

      const media = (
        <Avatar customer size="medium" name={fullname} source={avatar} />
      );

      return (
        <ResourceItem id={_id} media={media} name={fullname} onClick={action}>
          <Text variant="bodyMd" fontWeight="bold" as="h3">
            {fullname}, {selectPosition(position)}
          </Text>
          <div>{selectTag(item.tag)}</div>
        </ResourceItem>
      );
    },
    [action, selectPosition, selectTag],
  );

  return (
    <ResourceList
      emptyState={<StaffEmptyState action={action} />}
      items={value.sort((a, b) => (a.fullname > b.fullname ? 1 : -1))}
      alternateTool={<Button onClick={action}>{t("browse")}</Button>}
      renderItem={renderItem}
    />
  );
};

interface StaffEmptyStateProps {
  action: () => void;
}

const StaffEmptyState = ({ action }: StaffEmptyStateProps) => {
  const { t } = useTranslation("collections", {
    keyPrefix: "product.staff.empty",
  });

  return (
    <>
      <br />
      <EmptyState
        heading={t("title")}
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
        imageContained={true}
        fullWidth
        action={{ content: t("browse"), onAction: action }}
      />
    </>
  );
};
