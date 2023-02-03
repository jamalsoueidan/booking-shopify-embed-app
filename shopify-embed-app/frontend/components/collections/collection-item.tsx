import ModalConfirm from "@components/modals/ModalConfirm";
import {
  CollectionAggreate,
  Product,
  ProductStaffAggreate,
} from "@jamalsoueidan/bsb.mongodb.types";
import { HelperArray, useTranslation } from "@jamalsoueidan/bsf.bsf-pkg";
import { useCollectionDestroy } from "@services";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  ResourceItem,
  ResourceList,
  Stack,
  Text,
  TextContainer,
} from "@shopify/polaris";
import { memo, useCallback, useMemo, useState } from "react";
import MissingImage from "../MissingImage";

interface CollectionProps {
  collection: CollectionAggreate;
}

export default memo(({ collection }: CollectionProps) => {
  const [modalConfirm, setModalConfirm] = useState<JSX.Element>();
  const { destroy } = useCollectionDestroy({ collectionId: collection._id });
  const { t, tdynamic } = useTranslation({ id: "collection-item", locales });

  const setActive = useCallback(
    async (shouldDestroy: boolean) => {
      shouldDestroy && destroy();
      setModalConfirm(null);
    },
    [destroy],
  );

  const removeCollection = useCallback(() => {
    setModalConfirm(<ModalConfirm active={true} setActive={setActive} />);
  }, [setActive]);

  const renderItem = useCallback(
    (item: Product<ProductStaffAggreate>) => {
      const { _id, title, active, imageUrl } = item;

      const status = active ? "success" : "critical";

      return (
        <ResourceItem
          id={_id}
          url={"/collections/product/" + _id}
          name={title}
          media={
            imageUrl ? (
              <Avatar customer size="large" source={`${imageUrl}&width=80`} />
            ) : (
              <MissingImage />
            )
          }>
          <Stack spacing="tight">
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {title}
            </Text>
            <Badge status={status}>{active ? "Active" : "Deactive"}</Badge>
          </Stack>

          <Box paddingBlockStart="2">
            <div>
              {tdynamic("staff", {
                count: item.staff?.length || 0,
              })}
            </div>

            {item.staff?.length > 0 && (
              <Box paddingBlockStart="2">
                <Stack spacing="extraTight">
                  {[...item.staff]
                    .sort(HelperArray.soryTextBy("fullname") as any)
                    .map((staff) => (
                      <Avatar
                        key={staff._id}
                        customer
                        size="small"
                        name={staff.fullname}
                        source={staff.avatar}
                      />
                    ))}
                </Stack>
              </Box>
            )}
          </Box>
        </ResourceItem>
      );
    },
    [tdynamic],
  );

  const products = useMemo(
    () => [...collection.products].sort(HelperArray.soryTextBy("title")),
    [collection.products],
  );

  return (
    <>
      {modalConfirm}
      <TextContainer>
        <Text variant="headingLg" as="h1">
          {collection.title}{" "}
          <Button plain destructive onClick={removeCollection}>
            {t("remove_collection")}
          </Button>
        </Text>
        <Card>
          <ResourceList
            resourceName={{ plural: "products", singular: "product" }}
            items={products}
            renderItem={renderItem}
          />
        </Card>
      </TextContainer>
      <br />
      <br />
    </>
  );
});

const locales = {
  da: {
    remove_collection: "Fjern",
    staff: {
      other: "{count} medarbejder tilføjet",
      zero: "Tillføje medarbejder til dette produkt",
    },
  },
  en: {
    remove_collection: "Remove",
    staff: {
      other: "{count} staff added",
      zero: "Add staff to this product",
    },
  },
};
