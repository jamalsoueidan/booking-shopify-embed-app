import { Product } from "@jamalsoueidan/pkg.backend-types";
import { useTranslation } from "@jamalsoueidan/pkg.frontend";
import {
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Icon,
  Select,
  Stack,
  Text,
} from "@shopify/polaris";
import { ClockMajor } from "@shopify/polaris-icons";
import { FieldDictionary } from "@shopify/react-form";
import { memo, useCallback, useMemo } from "react";

export default memo(
  ({
    fields,
  }: {
    fields: FieldDictionary<Pick<Product, "buffertime" | "duration">>;
  }) => {
    const { t } = useTranslation({
      id: "collections-product-options",
      locales,
    });

    const options = useMemo(
      () => [
        { label: "0 min", value: "0" },
        { label: "5 min", value: "5" },
        { label: "10 min", value: "10" },
        { label: "15 min", value: "15" },
        { label: "20 min", value: "20" },
        { label: "25 min", value: "25" },
        { label: "30 min", value: "30" },
      ],
      [],
    );

    const selectLabel = useMemo(
      () => (
        <Stack spacing="tight">
          <Stack.Item>
            <Icon source={ClockMajor} />
          </Stack.Item>
          <Stack.Item>{t("buffertime.label")}</Stack.Item>
        </Stack>
      ),
      [t],
    );

    const onChangeSelect = useCallback(
      (value: string) => fields.buffertime.onChange(parseInt(value)),
      [fields.buffertime],
    );

    const onChange = useCallback(
      (value: number) => () => fields.duration.onChange(value),
      [fields.duration],
    );

    return (
      <>
        <Card sectioned>
          <FormLayout>
            <Text variant="headingSm" as="h6">
              {t("duration.label")}
            </Text>
            <ButtonGroup segmented>
              <Button
                pressed={fields.duration.value === 30}
                onClick={onChange(30)}>
                30 min
              </Button>
              <Button
                pressed={fields.duration.value === 45}
                onClick={onChange(45)}>
                45 min
              </Button>
              <Button
                pressed={fields.duration.value === 60}
                onClick={onChange(60)}>
                60 min
              </Button>
            </ButtonGroup>
          </FormLayout>
        </Card>
        <Card sectioned>
          <FormLayout>
            <Text variant="headingXs" as="h6">
              {t("duration.help")}
            </Text>
            <Select
              label={selectLabel}
              options={options}
              helpText={t("buffertime.help")}
              value={fields.buffertime.value?.toString()}
              onChange={onChangeSelect}
            />
          </FormLayout>
        </Card>
      </>
    );
  },
);

const locales = {
  da: {
    buffertime: {
      help: "Pause tid mellem møderne",
      label: "Pausetid",
    },
    description: "Ændre indstillinger for dette product?",
    duration: {
      help: "Hvor længe kommer behandling til at tag tid?",
      label: "Behandlingstid",
    },
    title: "Indstillinger",
  },
  en: {
    buffertime: {
      help: "Free time between meetings",
      label: "Buffertime",
    },
    description: "Change options for this product?",
    duration: {
      help: "How long should your meeting last?",
      label: "Meeting duration",
    },
    title: "Settings",
  },
};
