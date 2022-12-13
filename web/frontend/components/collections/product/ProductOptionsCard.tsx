import {
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Icon,
  Layout,
  Select,
  Stack,
  Text,
} from '@shopify/polaris';
import { ClockMajor } from '@shopify/polaris-icons';
import { FieldDictionary } from '@shopify/react-form';
import { useTranslation } from 'react-i18next';

export default ({
  fields,
}: {
  fields: FieldDictionary<Pick<Product, 'buffertime' | 'duration'>>;
}) => {
  const { t } = useTranslation('collections', { keyPrefix: 'product.options' });

  const options = [
    { label: '0 min', value: '0' },
    { label: '5 min', value: '5' },
    { label: '10 min', value: '10' },
    { label: '15 min', value: '15' },
    { label: '20 min', value: '20' },
    { label: '25 min', value: '25' },
    { label: '30 min', value: '30' },
  ];

  const selectLabel = (
    <Stack spacing="tight">
      <Stack.Item>
        <Icon source={ClockMajor} />
      </Stack.Item>
      <Stack.Item>{t('buffertime.label')}</Stack.Item>
    </Stack>
  );

  return (
    <Layout.AnnotatedSection
      id="settings"
      title={t('title')}
      description={t('description')}>
      <Card>
        <Card.Section>
          <FormLayout>
            <Text variant="headingSm" as="h6">
              {t('duration.label')}
            </Text>
            <ButtonGroup segmented>
              <Button
                pressed={fields.duration.value === 30}
                onClick={() => fields.duration.onChange(30)}>
                30 min
              </Button>
              <Button
                pressed={fields.duration.value === 45}
                onClick={() => fields.duration.onChange(45)}>
                45 min
              </Button>
              <Button
                pressed={fields.duration.value === 60}
                onClick={() => fields.duration.onChange(60)}>
                60 min
              </Button>
            </ButtonGroup>
            <Text variant="headingXs" as="h6">
              {t('duration.help')}
            </Text>
            <Select
              label={selectLabel}
              options={options}
              helpText={t('buffertime.help')}
              value={fields.buffertime.value.toString()}
              onChange={(value: string) =>
                fields.buffertime.onChange(parseInt(value))
              }
            />
          </FormLayout>
        </Card.Section>
      </Card>
    </Layout.AnnotatedSection>
  );
};
