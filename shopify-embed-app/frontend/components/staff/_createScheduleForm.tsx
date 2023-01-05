import { Columns, Layout, Select, TextField } from '@shopify/polaris';
import { Field } from '@shopify/react-form';

interface Fields {
  startTime: Field<string>;
  endTime: Field<string>;
  tag: Field<string>;
  available: Field<boolean>;
}

interface CreateScheduleFormProps {
  fields: Fields;
  options: any;
}

export const CreateScheduleForm = ({
  fields,
  options,
}: CreateScheduleFormProps) => {
  return (
    <>
      <Layout.Section>
        <Columns
          columns={{
            xs: '3fr 3fr',
            md: '3fr 3fr',
          }}>
          <TextField
            label="Tid fra"
            type="time"
            autoComplete="off"
            {...fields.startTime}
          />
          <TextField
            label="Tid til"
            type="time"
            autoComplete="off"
            {...fields.endTime}
          />
        </Columns>
      </Layout.Section>
      <Layout.Section>
        <Select label="Tag" options={options} {...fields.tag} />
      </Layout.Section>
    </>
  );
};
