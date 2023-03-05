import { useCollectionCreate } from '@jamalsoueidan/pkg.frontend';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { SelectPayload } from '@shopify/app-bridge/actions/ResourcePicker';
import { useCallback } from 'react';

interface Props {
  open: boolean;
  setOpen: any;
}

export default ({ open, setOpen }: Props) => {
  const { create } = useCollectionCreate();

  const handleSelection = useCallback(
    (resources: SelectPayload) => {
      const selections = resources.selection.map((s) => s.id);
      create({ selections });
      setOpen(false);
    },
    [create, setOpen]
  );

  const onCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <ResourcePicker
      resourceType="Collection"
      open={open}
      onSelection={handleSelection}
      onCancel={onCancel}
    />
  );
};
