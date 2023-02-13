import ProductActivate from "@components/collections/product/product-activate";
import ProductBanner from "@components/collections/product/product-banner";
import ProductOptionsCard from "@components/collections/product/product-options-card";
import ProductStaff from "@components/collections/product/product-staff";
import { ProductServiceUpdateBodyStaffProperty } from "@jamalsoueidan/bsb.types/product";
import { FormErrors, LoadingPage, useForm } from "@jamalsoueidan/pkg.bsf";
import { useProductGet, useProductUpdate } from "@services";
import { Badge, Form, Grid, Page, PageActions } from "@shopify/polaris";
import { useDynamicList, useField } from "@shopify/react-form";
import { useParams } from "react-router-dom";

export default () => {
  const params = useParams();

  const { data: product } = useProductGet({ id: params.id });
  const { update } = useProductUpdate({
    id: params.id,
  });

  const {
    fields,
    submit,
    submitErrors,
    dynamicLists: { staff },
    primaryAction,
  } = useForm({
    dynamicLists: {
      staff: useDynamicList<ProductServiceUpdateBodyStaffProperty>(
        product?.staff || [],
        (staff: ProductServiceUpdateBodyStaffProperty) => staff,
      ),
    },
    fields: {
      active: useField({
        validates: [],
        value: product?.active,
      }),
      buffertime: useField({
        validates: [],
        value: product?.buffertime,
      }),
      duration: useField({
        validates: [],
        value: product?.duration,
      }),
    },
    onSubmit: async (fieldValues) => {
      await update({
        active: fieldValues.active,
        buffertime: fieldValues.buffertime,
        duration: fieldValues.duration,
        staff: fieldValues.staff,
      });
      return { status: "success" };
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
          <Badge status={product.active ? "attention" : "info"}>
            {product.active ? "Active" : "Deactive"}
          </Badge>
        }
        breadcrumbs={[{ content: "Collections", url: "/collections" }]}>
        <FormErrors errors={submitErrors} />
        {product.staff.length === 0 && <ProductBanner />}
        <Grid>
          <Grid.Cell columnSpan={{ lg: 8, md: 4, sm: 6, xl: 8, xs: 6 }}>
            <ProductStaff product={product} form={staff} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ lg: 4, md: 2, sm: 6, xl: 4, xs: 6 }}>
            <ProductActivate
              active={fields.active}
              staffLength={product.staff.length}
            />

            <ProductOptionsCard fields={fields} />
          </Grid.Cell>
        </Grid>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};
