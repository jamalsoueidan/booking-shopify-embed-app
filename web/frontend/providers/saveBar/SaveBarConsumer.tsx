import { ContextualSaveBar } from '@shopify/polaris';
import { useContext } from 'react';
import { SaveBarContext } from './SaveBar.context';

export const SaveBarConsumer = () => {
  const { dirty, show, contextualSaveBar } = useContext(SaveBarContext);
  return dirty && show ? <ContextualSaveBar {...contextualSaveBar} /> : null;
};
