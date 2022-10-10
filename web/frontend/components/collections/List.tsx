import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button, Heading, TextContainer, TextStyle } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../../hooks";
import AddNewCategory from "./list/AddNewCategory";
import Collection from "./list/Collection";

export default ({ collections }: { collections: Array<Collection> }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleSelection = async (resources) => {
    setOpen(false);
  };

  const handleCancel = async () => {
    setOpen(false);
  };

  const renderCategories = () => {
    return collections.map((d) => <Collection collection={d}></Collection>);
  };

  return (
    <>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => handleCancel()}
      />
      <TextContainer>
        <Heading>Kategorier</Heading>
        <TextStyle variation="subdued">
          Listen af alle kategorier der bliver vist på hjemmesiden.
        </TextStyle>
        <br />
        <AddNewCategory collections={collections}></AddNewCategory>
      </TextContainer>
      <br />
      {renderCategories()}
    </>
  );
};
