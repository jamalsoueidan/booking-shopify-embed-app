import { Button, IndexTable, TextStyle } from "@shopify/polaris";

export default ({ products }: { products: Product[] }) => {
  const rowMarkup = products.map((product: Product, index) => (
    <IndexTable.Row id={product.id} key={product.id} position={index}>
      <IndexTable.Cell>
        <TextStyle variation="strong">{product.title}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button>Redigere</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <IndexTable
      itemCount={products.length}
      headings={[{ title: "Title" }, { title: "Action", hidden: false }]}
      selectable={false}
    >
      {rowMarkup}
    </IndexTable>
  );
};
