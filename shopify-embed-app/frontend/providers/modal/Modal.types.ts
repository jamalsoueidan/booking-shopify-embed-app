import { ComplexAction, ModalProps } from "@shopify/polaris";

export interface ModalContextProps extends ModalProps {
  setPrimaryAction: (value: ComplexAction | undefined) => void;
  setSecondaryActions: (value: ComplexAction[] | undefined) => void;
}
