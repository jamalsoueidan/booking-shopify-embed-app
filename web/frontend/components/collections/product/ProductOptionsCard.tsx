import { useCollectionProductUpdate } from '@services/product';
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Icon,
  Layout,
  Select,
  Stack,
  Text,
} from '@shopify/polaris';
import { ClockMajor } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';

export default ({
  productId,
  product,
}: {
  productId: string;
  product: Product;
}) => {
  const [duration, setDuration] = useState<string>(
    String(product.duration) || '0'
  );
  const [buffertime, setBuffertime] = useState<string>(
    String(product.buffertime) || '0'
  );

  const handleSelectChange = useCallback(
    (value: string) => setBuffertime(value),
    []
  );

  const options = [
    { label: '0 min', value: '0' },
    { label: '5 min', value: '5' },
    { label: '10 min', value: '10' },
    { label: '15 min', value: '15' },
    { label: '20 min', value: '20' },
    { label: '25 min', value: '25' },
    { label: '30 min', value: '30' },
  ];

  const { update } = useCollectionProductUpdate({ productId });
  const onSave = async () => {
    await update({
      buffertime: parseInt(buffertime),
      duration: parseInt(duration),
    });
  };

  const selectLabel = (
    <Stack spacing="tight">
      <Stack.Item>
        <Icon source={ClockMajor} />
      </Stack.Item>
      <Stack.Item>Buffertime</Stack.Item>
    </Stack>
  );

  return (
    <Layout>
      <Layout.AnnotatedSection
        id="settings"
        title="Indstillinger"
        description="Ændre indstillinger for den behandling?">
        <Card
          secondaryFooterActions={[{ content: 'Annullere' }]}
          primaryFooterAction={{
            content: 'Gem',
            onAction: onSave,
          }}>
          <Card.Section>
            <Form onSubmit={onSave}>
              <FormLayout>
                <Text variant="headingSm" as="h6">
                  Meeting duration
                </Text>
                <ButtonGroup segmented>
                  <Button
                    pressed={duration === '30'}
                    onClick={() => setDuration('30')}>
                    30 min
                  </Button>
                  <Button
                    pressed={duration === '45'}
                    onClick={() => setDuration('45')}>
                    45 min
                  </Button>
                  <Button
                    pressed={duration === '60'}
                    onClick={() => setDuration('60')}>
                    60 min
                  </Button>
                </ButtonGroup>
                <Text variant="headingXs" as="h6">
                  How long should your meeting last?(minutes)
                </Text>
                <Select
                  label={selectLabel}
                  options={options}
                  onChange={handleSelectChange}
                  value={buffertime}
                  helpText="Free time between meetings"
                />
              </FormLayout>
            </Form>
          </Card.Section>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  );
};
