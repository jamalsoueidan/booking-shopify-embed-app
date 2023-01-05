import { ComplexAction, Modal, ModalProps } from '@shopify/polaris';
import { ModalContext } from './Modal.context';
import { useMemo, useState } from 'react';

export const ModalProvider = (props: ModalProps) => {
  const [primaryAction, setPrimaryAction] = useState<ComplexAction>();
  const [secondaryActions, setSecondaryActions] = useState<ComplexAction[]>();

  const value = useMemo(
    () => ({
      ...props,
      setPrimaryAction,
      setSecondaryActions,
    }),
    [props, setPrimaryAction, setSecondaryActions]
  );

  return (
    <ModalContext.Provider value={value}>
      <Modal
        large
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        {...props}>
        {props.children}
      </Modal>
    </ModalContext.Provider>
  );
};
