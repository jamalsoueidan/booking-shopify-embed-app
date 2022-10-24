import { useNavigate } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import { useParams } from "react-router-dom";

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  return <Page narrowWidth>show product list</Page>;
};
