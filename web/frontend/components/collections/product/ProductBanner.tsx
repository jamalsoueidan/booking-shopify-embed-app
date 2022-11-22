import { Banner, BannerStatus, Layout } from '@shopify/polaris';

interface ExtendBanner {
  status: BannerStatus;
  title: string;
  errors: Array<{ message: string }>;
}

export default ({ product }: { product: Product }) => {
  const banner: ExtendBanner =
    product.staff.length === 0
      ? {
          status: 'warning',
          title: 'Tilføj staff til produktet',
          errors: [{ message: 'Tilføj staff til produktet' }],
        }
      : null;

  if (!banner) {
    <></>;
  }

  return (
    <Layout.Section>
      <Banner title={banner.title} status={banner.status}>
        <p>
          Før denne service kan aktiveres, skal du først tilføje medarbejder til
          produktet
        </p>
        <ul>
          {banner.errors.map(({ message }, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </Banner>
    </Layout.Section>
  );
};
