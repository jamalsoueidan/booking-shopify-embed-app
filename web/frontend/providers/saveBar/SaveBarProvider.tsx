import { useCallback, useRef, useState } from 'react';
import { SaveBarContext } from './SaveBar.context';
import { SaveBarConsumer } from './SaveBarConsumer';
import { setReset, setSubmit } from './SaveBar.types';

export const SaveBarProvider = ({ children }: any) => {
  const [dirty, setDirty] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const submit = useRef<setSubmit>();
  const reset = useRef<setReset>();

  const setReset = useCallback((value: setReset) => {
    reset.current = value;
  }, []);

  const setSubmit = useCallback((value: setSubmit) => {
    submit.current = value;
  }, []);

  return (
    <SaveBarContext.Provider
      value={{
        dirty,
        setDirty,
        submitting,
        setSubmitting,
        submit,
        reset,
        setReset,
        setSubmit,
      }}>
      <SaveBarConsumer></SaveBarConsumer>
      {children}
    </SaveBarContext.Provider>
  );
};
