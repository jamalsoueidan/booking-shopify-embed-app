import { Card, Modal, Tabs } from '@shopify/polaris';
import { useCallback, useRef, useState } from 'react';
import CreateAllSchedule from './CreateAllSchedule';
import CreateDaySchedule from './CreateDaySchedule';

interface RefMethod {
  submit: () => void;
}
export default ({ info, setInfo }: any) => {
  const ref = useRef<RefMethod>();
  const toggleActive = () => setInfo(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );

  const submit = useCallback(() => {
    setLoading(true);
    ref.current.submit();
  }, [ref]);

  const tabs = [
    {
      id: 'create-day',
      content: `Create for day`,
    },
    {
      id: 'create-all',
      content: 'Create for range',
    },
  ];

  return (
    <Modal
      open={true}
      onClose={toggleActive}
      title="New availability"
      primaryAction={{
        content: `${tabs[selected].content}`,
        onAction: submit,
        loading,
      }}
      secondaryActions={[
        {
          content: 'Luk',
          onAction: toggleActive,
        },
      ]}>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        {selected === 0 ? (
          <CreateDaySchedule
            ref={ref}
            date={info.dateStr}
            close={setInfo}></CreateDaySchedule>
        ) : (
          <CreateAllSchedule
            ref={ref}
            date={info.dateStr}
            close={setInfo}></CreateAllSchedule>
        )}
      </Tabs>
    </Modal>
  );
};
