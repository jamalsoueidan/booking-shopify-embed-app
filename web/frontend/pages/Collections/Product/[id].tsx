import ProductActivate from '@components/collections/product/ProductActivate';
import ProductBanner from '@components/collections/product/ProductBanner';
import ProductOptionsCard from '@components/collections/product/ProductOptionsCard';
import StaffCard from '@components/collections/product/staff/StaffCard';
import FormStatus from '@components/FormStatus';
import LoadingPage from '@components/LoadingPage';
import useSave from '@hooks/useSave';
import {
  useCollectionProductGet,
  useCollectionProductUpdate,
} from '@services/product';
import { ActionVerb } from '@shopify/app-bridge/actions/ResourcePicker';
import { Form, Layout, Page, PageActions } from '@shopify/polaris';
import {
  DynamicListBag,
  useDynamicList,
  useField,
  useForm,
} from '@shopify/react-form';
import { useParams } from 'react-router-dom';

export default () => {
  const params = useParams();

  const { data: product } = useCollectionProductGet({ productId: params.id });
  const { update } = useCollectionProductUpdate({
    productId: params.id,
  });

  const formFields = {
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
  };

  const staff = useDynamicList<StaffTag>(
    product?.staff || [],
    (staff): StaffTag[] => {
      return staff;
    }
  );

  const { fields, submit, reset, submitErrors, submitting, dirty } = useForm<
    typeof formFields,
    any
  >({
    fields: formFields,
    dynamicLists: {
      staff,
    },
    onSubmit: async (fieldValues) => {
      await update({
        buffertime: parseInt(fieldValues.buffertime),
        duration: fieldValues.duration,
        active: fieldValues.active,
        staff: staff.value,
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
            <FormStatus errors={submitErrors} success={submitting && dirty} />
            {product.staff.length === 0 && <ProductBanner></ProductBanner>}
            <ProductActivate
              active={fields.active}
              staffLength={product.staff.length}></ProductActivate>
            <br />
            <StaffCard product={product} form={staff}></StaffCard>
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
