import {
  Badge,
  Caption,
  Card,
  Icon,
  ResourceItem,
  ResourceList,
  TextStyle,
} from "@shopify/polaris";
import { ProductsMajor } from "@shopify/polaris-icons";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useAuthenticatedFetch } from "../../hooks";
import ModalConfirm from "../modals/ModalConfirm.js";

export default ({ collection }: { collection: Collection }) => {
  const [modalConfirm, setModalConfirm] = useState<any>();

  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const { data } = useSWR<CollectionsApi>(
    "/api/admin/collections",
    (apiURL: string) => fetch(apiURL).then((res) => res.json())
  );

  const removeCollection = (collection) => {
    const setActive = async (value) => {
      if (value) {
        await fetch(`/api/admin/collections/${collection._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
      }
      mutate("/api/admin/collections");
      setModalConfirm(null);
    };

    setModalConfirm(
      <ModalConfirm active={true} setActive={setActive}></ModalConfirm>
    );
  };

  return (
    <>
      {modalConfirm}
      <Card
        key={collection._id}
        title={collection.title}
        actions={[
          {
            content: "Remove",
            destructive: true,
            onClick: () => {
              removeCollection(collection);
            },
          },
        ]}
      >
        <ResourceList
          resourceName={{ singular: "product", plural: "products" }}
          items={collection.products}
          renderItem={(item) => {
            const { _id, title } = item;

            const critical = item.staff.length === 0 || !item.duration;
            const status = critical ? "critical" : "success";

            return (
              <ResourceItem
                id={_id}
                url={"/Collections/Product/" + _id}
                accessibilityLabel={`View details for ${title}`}
                media={<Icon source={ProductsMajor} color={status} />}
                verticalAlignment="center"
              >
                <h3>
                  <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <Caption>{item.staff.length} staff added.</Caption>
              </ResourceItem>
            );
          }}
          showHeader
          totalItemsCount={collection.products.length}
        />
      </Card>
    </>
  );
};
