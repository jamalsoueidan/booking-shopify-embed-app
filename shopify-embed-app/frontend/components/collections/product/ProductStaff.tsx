import { useTranslation } from '@hooks';
import { Product, ProductAggreate, ProductStaffAggreate } from '@jamalsoueidan/bsb.mongodb.types';
import { Card } from '@shopify/polaris';
import { DynamicList } from '@shopify/react-form/build/ts/hooks/list/dynamiclist';
import { Suspense, lazy, memo, useCallback, useState } from 'react';
import FormContext from './staff/FormContext';
import StaffList from './staff/StaffList';

const StaffModal = lazy(() => import('./staff/StaffModal'));
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
      <Card title={t('title')}>
        <StaffList action={show}></StaffList>
        <Suspense>
          <StaffModal
            productId={product._id}
            show={showModal}
            close={hide}></StaffModal>
        </Suspense>
      </Card>
    </FormContext.Provider>
  );
});
