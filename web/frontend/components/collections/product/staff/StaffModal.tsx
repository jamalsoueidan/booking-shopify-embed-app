import TagOptions from '@components/staff/TagOptions';
import { useCollectionProductStaff } from '@services/product/staff';
import { ChoiceList, Modal, OptionList, Spinner } from '@shopify/polaris';
import { useEffect } from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import FormContext from './FormContext';

interface StaffModalProps {
  productId: string;
  show: boolean;
  close: () => void;
}

export default ({ productId, show, close }: StaffModalProps) => {
  const { data } = useCollectionProductStaff({ productId });
  const { value, fields, addItem, removeItems } = useContext(FormContext);
  const [selected, setSelected] = useState<Array<StaffTag>>([]);

  const toggle = useCallback(
    (value: StaffTag) => {
      // first we remove the selected Staff
      const newSelected = selected.filter((s) => s._id !== value._id);
      // then if tag is NOT null, we the selected staff
      if (value.tag) {
        newSelected.push(value);
      }
      setSelected(() => newSelected);
    },
    [selected]
  );

  const submit = () => {
    if (JSON.stringify(value) !== JSON.stringify(selected)) {
      removeItems(fields.map((_, index) => index));
      selected.forEach((s) => addItem(s));
    }
    close();
  };

  // onOpen update selected to correspond to the useForm
  useEffect(() => {
    setSelected(() => [...value]);
  }, [value]);

  const choices = data
    ?.sort((a, b) => (a.fullname > b.fullname ? 1 : -1))
    .map((staff) => (
      <ChoiceStaff
        key={staff._id}
        staff={staff}
        toggle={toggle}
        selected={selected}
      />
    ));

  return (
    <Modal
      open={show}
      onClose={close}
      title="Medarbejder"
      primaryAction={{
        content: 'Done',
        onAction: submit,
        disabled: selected.length === 0,
      }}
      secondaryActions={[
        {
          content: 'Luk',
          onAction: close,
        },
      ]}>
      {!choices && (
        <Modal.Section>
          <div style={{ textAlign: 'center' }}>
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </div>
        </Modal.Section>
      )}
      {choices?.map((c, index) => c)}
    </Modal>
  );
};

interface ChoiceStaffProps {
  staff: ProductStaffToAdd;
  selected: Array<StaffTag>;
  toggle: (value: StaffTag) => void;
}

const ChoiceStaff = ({ staff, selected, toggle }: ChoiceStaffProps) => {
  const choices = useMemo(
    () =>
      staff.tags.sort().map((t) => {
        return {
          value: t,
          label: TagOptions.find((o) => o.value === t).label,
        };
      }),
    [staff.tags]
  );

  const handleChange = useCallback(
    (value: string[]) => {
      toggle({ _id: staff._id, fullname: staff.fullname, tag: value[0] });
    },
    [toggle]
  );

  const choiceSelected = selected
    .filter((s) => s._id === staff._id)
    .map((s) => s.tag);

  return (
    <OptionList
      title={staff.fullname}
      options={choices}
      selected={choiceSelected}
      onChange={handleChange}
      allowMultiple
    />
  );
};
