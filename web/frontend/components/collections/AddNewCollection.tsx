import { ResourcePicker } from '@shopify/app-bridge-react';
import { useCollectionCreate } from '@services/collection';

interface Props {
  open: boolean;
  setOpen: any;
}

export default ({ open, setOpen }: Props) => {
  const { create } = useCollectionCreate();

  const handleSelection = async (resources: Resources) => {
    const selections = resources.selection.map((s) => s.id);
    await create({ selections });
    setOpen(false);
  };

  return (
    <ResourcePicker
      resourceType="Collection"
      open={open}
      onSelection={(resources) => handleSelection(resources)}
      onCancel={() => setOpen(false)}
    />
  );
};
