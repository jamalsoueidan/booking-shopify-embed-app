import { ContextualSaveBarProps } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';
import { SaveBarContext } from './SaveBar.context';
import { ShowBarFormProps } from './SaveBar.types';
import { SaveBarConsumer } from './SaveBarConsumer';

export const SaveBarProvider = ({ children }: any) => {
  const [form, setForm] = useState<ShowBarFormProps>();
  const [contextualSaveBar, setContextualSaveBar] =
    useState<ContextualSaveBarProps>();

  const changeForm = useCallback((newValues: Partial<ShowBarFormProps>) => {
    setForm((value) => ({ ...value, ...newValues }));
  }, []);

  const changeSaveBar = useCallback(
    (newValues: Partial<ContextualSaveBarProps>) => {
      setContextualSaveBar(() => newValues);
    },
    []
  );

  const value = useMemo(
    () => ({
      form,
      setForm: changeForm,
      contextualSaveBar,
      setContextualSaveBar: changeSaveBar,
    }),
    [form, contextualSaveBar]
  );

  return (
    <SaveBarContext.Provider value={value}>
      <SaveBarConsumer></SaveBarConsumer>
      {children}
    </SaveBarContext.Provider>
  );
};
