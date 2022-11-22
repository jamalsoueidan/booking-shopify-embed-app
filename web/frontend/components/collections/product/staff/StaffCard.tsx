import { Card, Layout } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import AddStaff from './AddStaff';
import ExistingStaff from './ExistingStaff';

export default ({ product }: { product: Product }) => {
  const [showStaff, setShowStaff] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const toggleShowStaff = useCallback(
    () => setShowStaff((showStaff) => !showStaff),
    []
  );

  const toggleCanDelete = useCallback(
    () => setCanDelete((canDelete) => !canDelete),
    []
  );

  const actions =
    product.staff.length > 0
      ? [
          {
            content: canDelete ? 'Færdig' : 'Administrer',
            onAction: toggleCanDelete,
          },
        ]
      : [];

  return (
    <Layout.AnnotatedSection
      id="staff"
      title="Tilføj medarbejder"
      description="Hvilken medarbejder kan man booke service hos?">
      <Card actions={actions}>
        <Card.Section>
          <ExistingStaff
            productId={product._id}
            toggleAddStaff={toggleShowStaff}
            canDelete={canDelete}
            toggleCanDelete={setCanDelete}></ExistingStaff>
        </Card.Section>
        {showStaff && (
          <Card.Section>
            <AddStaff
              productId={product._id}
              setShowStaff={toggleShowStaff}></AddStaff>
          </Card.Section>
        )}
      </Card>
    </Layout.AnnotatedSection>
  );
};
