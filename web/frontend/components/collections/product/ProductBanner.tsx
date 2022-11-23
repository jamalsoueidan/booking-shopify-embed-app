import { Banner, Layout } from '@shopify/polaris';

export default () => {
  const errors = [{ message: 'Tilføj staff til produktet' }];

  return (
    <Layout.Section>
      <Banner title="Tilføj staff til produktet" status="warning">
        <p>
          Før denne service kan aktiveres, skal du først tilføje medarbejder til
          produktet
        </p>
        <ul>
          {errors.map(({ message }, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </Banner>
    </Layout.Section>
  );
};
