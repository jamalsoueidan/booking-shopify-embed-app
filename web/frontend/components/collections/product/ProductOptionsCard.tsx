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
import { ProductFormFields } from './FormFields';

export default ({ fields }: { fields: ProductFormFields }) => {
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
      <Stack.Item>Buffertime</Stack.Item>
    </Stack>
  );

  return (
    <Layout.AnnotatedSection
      id="settings"
      title="Indstillinger"
      description="Ændre indstillinger for den behandling?">
      <Card>
        <Card.Section>
          <FormLayout>
            <Text variant="headingSm" as="h6">
              Meeting duration
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
              How long should your meeting last?(minutes)
            </Text>
            <Select
              label={selectLabel}
              options={options}
              helpText="Free time between meetings"
              {...fields.buffertime}
            />
          </FormLayout>
        </Card.Section>
      </Card>
    </Layout.AnnotatedSection>
  );
};
