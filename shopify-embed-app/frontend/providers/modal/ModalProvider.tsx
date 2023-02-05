import { ComplexAction, Modal, ModalProps } from "@shopify/polaris";
import { useMemo, useState } from "react";
import { ModalContext } from "./Modal.context";

export const ModalProvider = (props: ModalProps) => {
  const [primaryAction, setPrimaryAction] = useState<
    ComplexAction | undefined
  >();
  const [secondaryActions, setSecondaryActions] = useState<
    ComplexAction[] | undefined
  >();

  const value = useMemo(
    () => ({
      ...props,
      setPrimaryAction,
      setSecondaryActions,
    }),
    [props, setPrimaryAction, setSecondaryActions],
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
