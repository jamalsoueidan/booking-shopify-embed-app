import { Card, Layout } from '@shopify/polaris';
import { FieldDictionary } from '@shopify/react-form';
import { DynamicList } from '@shopify/react-form/build/ts/hooks/list/dynamiclist';
import { useCallback, useState } from 'react';
import AddStaff from './AddStaff';
import ExistingStaff from './ExistingStaff';
import FormContext from './FormContext';

interface StaffCardProps {
  product: Product;
  form: DynamicList<StaffTag>;
}

export default ({ product, form }: StaffCardProps) => {
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
    form.value.length > 0
      ? [
          {
            content: canDelete ? 'Færdig' : 'Administrer',
            onAction: toggleCanDelete,
          },
        ]
      : [];

  return (
    <FormContext.Provider value={form}>
      <Layout.AnnotatedSection
        id="staff"
        title="Tilføj medarbejder"
        description="Hvilken medarbejder kan man booke service hos?">
        <Card actions={actions}>
          <Card.Section>
            <ExistingStaff
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
    </FormContext.Provider>
  );
};
