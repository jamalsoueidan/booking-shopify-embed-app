import { Card, TextStyle } from "@shopify/polaris";
import Products from "./Products";

export default ({ collection }: { collection: Collection }) => {
  return (
    <>
      <Card
        key={collection.id}
        title={collection.title}
        actions={[
          { content: "Delete", destructive: true },
          { content: "Edit" },
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
