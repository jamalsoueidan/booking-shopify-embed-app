import { Modal, Tabs } from '@shopify/polaris';
import { useCallback, useRef, useState } from 'react';
import CreateAllSchedule from './CreateAllSchedule';
import CreateDaySchedule from './CreateDaySchedule';

interface RefMethod {
  submit: () => boolean;
}

export default ({ info, setInfo }: any) => {
  const ref = useRef<RefMethod>();
  const toggleActive = useCallback(() => setInfo(null), []);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );

  const submit = useCallback(() => {
    setLoading(ref.current.submit());
  }, [ref]);

  const tabs = [
    {
      id: 'create-all',
      content: 'Create for range',
    },
    {
      id: 'create-day',
      content: `Create for day`,
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
        {tabs[selected].id === 'create-day' ? (
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
