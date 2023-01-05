import { FormErrors } from '@components/FormErrors';
import LoadingPage from '@components/LoadingPage';
import ProductActivate from '@components/collections/product/ProductActivate';
import ProductBanner from '@components/collections/product/ProductBanner';
import ProductOptionsCard from '@components/collections/product/ProductOptionsCard';
import ProductStaff from '@components/collections/product/ProductStaff';
import { useExtendForm } from '@hooks';
import { useProductGet, useProductUpdate } from '@services';
import { Badge, Form, Grid, Page, PageActions } from '@shopify/polaris';
import { useDynamicList, useField } from '@shopify/react-form';
import { useParams } from 'react-router-dom';

export default () => {
  const params = useParams();

  const { data: product } = useProductGet({ productId: params.id });
  const { update } = useProductUpdate({
    productId: params.id,
  });

  const {
    fields,
    submit,
    submitErrors,
    dynamicLists: { staff },
    primaryAction,
  } = useExtendForm({
    fields: {
      buffertime: useField({
        value: product?.buffertime,
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
    dynamicLists: {
      staff: useDynamicList<ProductStaffAggreate>(
        product?.staff || [],
        (staff: ProductStaffAggreate) => staff
      ),
    },
    onSubmit: async (fieldValues) => {
      await update({
        buffertime: fieldValues.buffertime,
        duration: fieldValues.duration,
        active: fieldValues.active,
        staff: fieldValues.staff,
      });
      return { status: 'success' };
    },
  });

  if (!product) {
    return <LoadingPage title="Loading product details" />;
  }

  return (
    <Form onSubmit={submit}>
      <Page
        fullWidth
        title={product?.title}
        titleMetadata={
          <Badge status={product.active ? 'attention' : 'info'}>
            {product.active ? 'Active' : 'Deactive'}
          </Badge>
        }
        breadcrumbs={[{ content: 'Collections', url: '/Collections' }]}>
        <FormErrors errors={submitErrors} />
        {product.staff.length === 0 && <ProductBanner></ProductBanner>}
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
            <ProductStaff product={product} form={staff}></ProductStaff>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
            <ProductActivate
              active={fields.active}
              staffLength={product.staff.length}></ProductActivate>

            <ProductOptionsCard fields={fields}></ProductOptionsCard>
          </Grid.Cell>
        </Grid>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};
