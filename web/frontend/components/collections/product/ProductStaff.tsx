import { Card, Layout } from '@shopify/polaris';
import { DynamicList } from '@shopify/react-form/build/ts/hooks/list/dynamiclist';
import { useCallback, useState } from 'react';
import { useTranslation } from '@hooks';
import FormContext from './staff/FormContext';
import StaffList from './staff/StaffList';
import StaffModal from './staff/StaffModal';

interface StaffCardProps {
  product: Product;
  form: DynamicList<ProductStaffAggreate>;
}

export default ({ product, form }: StaffCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation('collections', { keyPrefix: 'product.staff' });

  const action = useCallback(() => setShowModal(() => true), []);

  return (
    <FormContext.Provider value={form}>
      <Layout.AnnotatedSection
        id="staff"
        title={t('title')}
        description={t('description')}>
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
