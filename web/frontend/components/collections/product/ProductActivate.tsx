import { Layout, SettingToggle, Text } from '@shopify/polaris';
import { ProductFormFields } from './FormFields';

interface FormFields extends Pick<ProductFormFields, 'active'> {
  staffLength: number;
}

export default ({ active, staffLength }: FormFields) => {
  const contentStatus = active.value ? 'Deaktivere' : 'Aktivere';
  const textStatus = active.value ? 'books' : 'ikke books';

  return (
    <Layout.AnnotatedSection>
      <SettingToggle
        action={{
          content: contentStatus,
          onAction: () => active.onChange(!active.value),
          disabled: staffLength === 0,
        }}
        enabled={active.value}>
        Dette product kan{' '}
        <Text variant="headingSm" as="span">
          {textStatus}
        </Text>{' '}
        online.
      </SettingToggle>
    </Layout.AnnotatedSection>
  );
};
