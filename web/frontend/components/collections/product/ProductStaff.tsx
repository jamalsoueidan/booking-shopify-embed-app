import { useTranslation } from '@hooks';
import { Card, Layout } from '@shopify/polaris';
import { DynamicList } from '@shopify/react-form/build/ts/hooks/list/dynamiclist';
import { memo, useCallback, useState } from 'react';
import FormContext from './staff/FormContext';
import StaffList from './staff/StaffList';
import StaffModal from './staff/StaffModal';

interface StaffCardProps {
  product: Product | ProductAggreate;
  form: DynamicList<ProductStaffAggreate>;
}

export default memo(({ product, form }: StaffCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation('collections', { keyPrefix: 'product.staff' });

  const show = useCallback(() => setShowModal(() => true), []);
  const hide = useCallback(() => setShowModal(() => false), []);

  return (
    <FormContext.Provider value={form}>
      <Layout.AnnotatedSection
        id="staff"
        title={t('title')}
        description={t('description')}>
        <Card>
          <StaffList action={show}></StaffList>
          <StaffModal
            productId={product._id}
            show={showModal}
            close={hide}></StaffModal>
        </Card>
      </Layout.AnnotatedSection>
    </FormContext.Provider>
  );
});
