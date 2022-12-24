import { ComplexAction, Modal, ModalProps } from '@shopify/polaris';
import { ModalContext } from './Modal.context';
import { useState } from 'react';

export const ModalProvider = (props: ModalProps) => {
  const [primaryAction, setPrimaryAction] = useState<ComplexAction>();
  const [secondaryActions, setSecondaryActions] = useState<ComplexAction[]>();

  return (
    <ModalContext.Provider
      value={{ ...props, setPrimaryAction, setSecondaryActions }}>
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
