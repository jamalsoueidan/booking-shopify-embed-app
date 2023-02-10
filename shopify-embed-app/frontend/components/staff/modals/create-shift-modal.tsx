import {
  CreateManyShiftsRefMethod,
  CreateOneShiftRefMethod,
  LoadingSpinner,
} from "@jamalsoueidan/pkg.bsf";
import { Modal, Tabs } from "@shopify/polaris";
import { Suspense, lazy, useCallback, useRef, useState } from "react";

const CreateManyShiftsForm = lazy(() =>
  import("./create-many-shifts-form").then((module) => ({
    default: module.CreateManyShiftsModal,
  })),
);

const CreateOneShiftForm = lazy(() =>
  import("./create-one-shift-form").then((module) => ({
    default: module.CreateOneShiftModal,
  })),
);

interface CreateShiftModalProps {
  selectedDate: Date;
  close: () => void;
}

export const CreateShiftModal = ({
  selectedDate,
  close,
}: CreateShiftModalProps) => {
  const ref = useRef<CreateManyShiftsRefMethod | CreateOneShiftRefMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const submit = useCallback(() => {
    const noErrors = ref.current.submit().length === 0;
    setLoading(true);
    if (noErrors) {
      close();
    }
  }, [close]);

  const tabs = [
    {
      content: "Create for range",
      id: "create-all",
    },
    {
      content: `Create for day`,
      id: "create-day",
    },
  ];

  return (
    <Modal
      open={true}
      onClose={close}
      title="New availability"
      primaryAction={{
        content: `${tabs[selected].content}`,
        loading,
        onAction: submit,
      }}
      secondaryActions={[
        {
          content: "Luk",
          onAction: () => close(),
        },
      ]}>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Modal.Section>
          {tabs[selected].id === "create-day" ? (
            <Suspense fallback={<LoadingSpinner />}>
              <CreateOneShiftForm ref={ref} selectedDate={selectedDate} />
            </Suspense>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <CreateManyShiftsForm ref={ref} selectedDate={selectedDate} />
            </Suspense>
          )}
        </Modal.Section>
      </Tabs>
    </Modal>
  );
};
