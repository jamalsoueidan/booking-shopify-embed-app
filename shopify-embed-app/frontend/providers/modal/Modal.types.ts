import { ComplexAction, ModalProps } from '@shopify/polaris';

export interface ModalContextProps extends ModalProps {
  setPrimaryAction: (value: ComplexAction) => void;
  setSecondaryActions: (value: ComplexAction[]) => void;
}
