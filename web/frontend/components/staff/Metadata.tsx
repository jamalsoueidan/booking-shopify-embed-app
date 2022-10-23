import { Badge } from "@shopify/polaris";

export default ({ active }) => {
  return active ? (
    <Badge status="success">Active</Badge>
  ) : (
    <Badge status="warning">Deactivated</Badge>
  );
};
