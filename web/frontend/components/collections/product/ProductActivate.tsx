import { Layout, SettingToggle, Text } from '@shopify/polaris';
import { useTranslation, Trans } from 'react-i18next';
import { ProductFormFields } from './FormFields';

interface FormFields extends Pick<ProductFormFields, 'active'> {
  staffLength: number;
}

export default ({ active, staffLength }: FormFields) => {
  const { t } = useTranslation('collections', { keyPrefix: 'product' });

  const contentStatus = active.value ? 'deactivate' : 'activate';
  const textStatus = active.value ? 'status_active' : 'status_deactive';

  return (
    <Layout.AnnotatedSection>
      <SettingToggle
        action={{
          content: t(contentStatus),
          onAction: () => active.onChange(!active.value),
          disabled: staffLength === 0,
        }}
        enabled={active.value}>
        {t(textStatus)}
      </SettingToggle>
    </Layout.AnnotatedSection>
  );
};
