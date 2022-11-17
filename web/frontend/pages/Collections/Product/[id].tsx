import { Page } from '@shopify/polaris';
import { useParams } from 'react-router-dom';
import { useCollectionProductGet } from '@services/product';
import ProductActivate from '@components/collections/product/ProductActivate';
import ProductOptionsCard from '@components/collections/product/ProductOptionsCard';
import StaffCard from '@components/collections/product/staff/StaffCard';

export default () => {
  const params = useParams();

  const { data: product } = useCollectionProductGet({ productId: params.id });

  return (
    <Page
      narrowWidth
      title={product?.title}
      breadcrumbs={[{ content: 'Collections', url: '/Collections' }]}>
      {product && (
        <>
          <ProductActivate product={product}></ProductActivate>
          <br />
          <StaffCard product={product}></StaffCard>
          <br />
          <ProductOptionsCard
            product={product}
            productId={product?._id}></ProductOptionsCard>
          <br />
        </>
      )}
    </Page>
  );
};
