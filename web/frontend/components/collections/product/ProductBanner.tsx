import { Banner, Layout } from '@shopify/polaris';

export default () => {
  return (
    <Layout.Section>
      <Banner title="Tilføj staff til produktet" status="warning">
        <p>
          Før denne service kan aktiveres, skal du først tilføje medarbejder til
          produktet
        </p>
      </Banner>
    </Layout.Section>
  );
};
