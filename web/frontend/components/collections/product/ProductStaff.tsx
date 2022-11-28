import { Card, Layout } from '@shopify/polaris';
import { DynamicList } from '@shopify/react-form/build/ts/hooks/list/dynamiclist';
import { useCallback, useState } from 'react';
import FormContext from './staff/FormContext';
import StaffList from './staff/StaffList';
import StaffModal from './staff/StaffModal';

interface StaffCardProps {
  product: Product;
  form: DynamicList<StaffTag>;
}

export default ({ product, form }: StaffCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const action = useCallback(() => setShowModal(() => true), []);

  return (
    <FormContext.Provider value={form}>
      <Layout.AnnotatedSection
        id="staff"
        title="Tilføj medarbejder"
        description="Hvilken medarbejder kan man booke service hos?">
        <Card>
          <StaffList action={action}></StaffList>
          <StaffModal
            productId={product._id}
            show={showModal}
            close={() => setShowModal(() => false)}></StaffModal>
        </Card>
      </Layout.AnnotatedSection>
    </FormContext.Provider>
  );
};
