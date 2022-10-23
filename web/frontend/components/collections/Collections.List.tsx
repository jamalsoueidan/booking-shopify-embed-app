import { Card, TextStyle } from "@shopify/polaris";
import Products from "./Products";

export default ({ collection }: { collection: Collection }) => {
  const removeCollection = (collection) => {};

  return (
    <>
      <Card
        key={collection.id}
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
        <Card.Section>
          <TextStyle variation="subdued">
            {collection.products.nodes.length} products
          </TextStyle>
        </Card.Section>
        <Card>
          {<Products products={collection.products.nodes}></Products>}
        </Card>
      </Card>
    </>
  );
};
