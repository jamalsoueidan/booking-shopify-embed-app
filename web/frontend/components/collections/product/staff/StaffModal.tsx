import { useTagOptions, usePositions, useTranslation } from '@hooks';
import { useProductStaff } from '@services';
import { Modal, OptionList, Spinner, Text } from '@shopify/polaris';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import FormContext from './FormContext';

interface StaffModalProps {
  productId: string;
  show: boolean;
  close: () => void;
}

export default ({ productId, show, close }: StaffModalProps) => {
  const { t } = useTranslation('collections', {
    keyPrefix: 'product.staff.modal',
  });

  const { data } = useProductStaff({ productId });
  const { value, fields, addItem, removeItems } = useContext(FormContext);
  const [selected, setSelected] = useState<Array<ProductStaffAggreate>>([]);

  const toggle = useCallback(
    (value: ProductStaffAggreate) => {
      console.log(value);
      // first we remove the selected Staff
      const newSelected = selected.filter((s) => s._id !== value._id);
      // then if tag is NOT null, we the selected staff
      if (value.tag) {
        newSelected.push(value);
      }
      console.log(newSelected);
      setSelected(() => newSelected);
    },
    [selected]
  );

  const didChange = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(selected),
    [value, selected]
  );

  const submit = () => {
    if (didChange) {
      removeItems(fields.map((_, index) => index));
      selected.forEach((s) => addItem(s));
    }
    close();
  };

  // onOpen update selected to correspond to the useForm
  useEffect(() => {
    console.log(value);
    setSelected(() => [...value]);
  }, [value]);

  const choices = useMemo(() => {
    if (!data) {
      return;
    }

    const sorted = [...data].sort((a, b) => (a.fullname > b.fullname ? 1 : -1));
    return sorted.map((staff) => (
      <ChoiceStaff
        key={staff._id}
        staff={staff}
        toggle={toggle}
        selected={selected}
      />
    ));
  }, [data, selected, toggle]);

  return (
    <Modal
      open={show}
      onClose={close}
      title={t('title')}
      primaryAction={{
        content: t('done'),
        onAction: submit,
        disabled: !didChange,
      }}
      secondaryActions={[
        {
          content: t('close'),
          onAction: close,
        },
      ]}>
      <>
        {data?.length === 0 && (
          <Modal.Section>
            <Text variant="bodyLg" as="p">
              Ingen medarbejder har registeret arbejdstimer
            </Text>
          </Modal.Section>
        )}
        {!choices && (
          <Modal.Section>
            <div style={{ textAlign: 'center' }}>
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
          </Modal.Section>
        )}
        {choices}
      </>
    </Modal>
  );
};

interface ChoiceStaffProps {
  staff: ProductAddStaff;
  selected: Array<ProductStaffAggreate>;
  toggle: (value: ProductStaffAggreate) => void;
}

const ChoiceStaff = ({ staff, selected, toggle }: ChoiceStaffProps) => {
  const { select: selectTag } = useTagOptions();
  const { select: selectPosition } = usePositions();

  const choices = useMemo(
    () =>
      [...staff.tags].sort().map((t) => {
        return {
          value: t,
          label: selectTag(t),
        };
      }),
    [staff.tags]
  );

  const handleChange = useCallback(
    (value: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tags, ...spreadStaff } = staff;
      toggle({ ...spreadStaff, tag: value[0] });
    },
    [toggle, staff]
  );

  const choiceSelected = selected
    .filter((s) => s._id === staff._id)
    .map((s) => s.tag);

  console.log(selected, choiceSelected);

  return (
    <OptionList
      title={staff.fullname + ', ' + selectPosition(staff.position)}
      options={choices}
      selected={choiceSelected}
      onChange={handleChange}
      allowMultiple
    />
  );
};
