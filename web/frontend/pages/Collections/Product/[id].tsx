import ProductActivate from '@components/collections/product/ProductActivate';
import ProductBanner from '@components/collections/product/ProductBanner';
import ProductOptionsCard from '@components/collections/product/ProductOptionsCard';
import StaffCard from '@components/collections/product/staff/StaffCard';
import LoadingPage from '@components/LoadingPage';
import useSave from '@hooks/useSave';
import {
  useCollectionProductGet,
  useCollectionProductUpdate,
} from '@services/product';
import { Form, Layout, Page, PageActions } from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import { useParams } from 'react-router-dom';

export default () => {
  const params = useParams();

  const { data: product } = useCollectionProductGet({ productId: params.id });
  const { update } = useCollectionProductUpdate({
    productId: params.id,
  });

  const { fields, submit, reset, submitErrors, submitting, dirty } = useForm({
    fields: {
      buffertime: useField({
        value: product?.buffertime.toString(),
        validates: [],
      }),
      duration: useField({
        value: product?.duration,
        validates: [],
      }),
      active: useField({
        value: product?.active,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      await update({
        buffertime: parseInt(fieldValues.buffertime),
        duration: fieldValues.duration,
      });
      return { status: 'success' };
    },
  });

  const { primaryAction, saveBar } = useSave({
    dirty,
    reset,
    submit,
    submitting,
  });

  if (!product) {
    return <LoadingPage />;
  }

  return (
    <Form onSubmit={submit}>
      <Page
        title={product?.title}
        breadcrumbs={[{ content: 'Collections', url: '/Collections' }]}>
        {saveBar}
        {product && (
          <Layout>
            <ProductBanner product={product}></ProductBanner>
            <ProductActivate
              active={fields.active}
              staffLength={product.staff.length}></ProductActivate>
            <br />
            <StaffCard product={product}></StaffCard>
            <br />
            <ProductOptionsCard fields={fields}></ProductOptionsCard>
          </Layout>
        )}
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};
