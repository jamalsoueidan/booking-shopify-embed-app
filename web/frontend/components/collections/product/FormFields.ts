import { Field } from '@shopify/react-form';

export interface ProductFormFields {
  buffertime: Field<string>;
  duration: Field<number>;
  active: Field<boolean>;
}
