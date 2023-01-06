import { Card, FormLayout, Layout, Page, TextField } from "@shopify/polaris";

export const AppPage = () => {
  return (
    <Page title="Account">
      <Layout>
        <Layout.AnnotatedSection
          title="Account details"
          description="Jaded Pixel will use this as your account information."
        >
          <Card sectioned>
            <FormLayout>
              <TextField label="Full name" autoComplete="name" />
              <TextField type="email" label="Email" autoComplete="email" />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};
