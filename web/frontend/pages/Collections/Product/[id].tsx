import { Page } from '@shopify/polaris';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import ProductActivate from '../../../components/collections/product/ProductActivate';
import ProductOptionsCard from '../../../components/collections/product/ProductOptionsCard';
import StaffCard from '../../../components/collections/product/staff/StaffCard';
import { useAuthenticatedFetch } from '../../../hooks';

export default () => {
  const params = useParams();
  const fetch = useAuthenticatedFetch();

  const { data: product } = useSWR<ProductApi>(
    `/api/admin/products/${params.id}`,
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  return (
    <Page
      narrowWidth
      title={product?.payload?.title}
      breadcrumbs={[{ content: 'Collections', url: '/Collections' }]}>
      {product?.payload && (
        <>
          <ProductActivate product={product?.payload}></ProductActivate>
          <br />
          <StaffCard product={product?.payload}></StaffCard>
          <br />
          <ProductOptionsCard
            product={product?.payload}
            productId={product?.payload._id}></ProductOptionsCard>
          <br />
        </>
      )}
    </Page>
  );
};
