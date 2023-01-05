import { ContextualSaveBar } from '@shopify/polaris';
import { useContext } from 'react';
import { SaveBarContext } from './SaveBar.context';

export const SaveBarConsumer = () => {
  const { form, contextualSaveBar } = useContext(SaveBarContext);

  return form?.dirty && form?.show ? (
    <ContextualSaveBar {...contextualSaveBar} />
  ) : null;
};
