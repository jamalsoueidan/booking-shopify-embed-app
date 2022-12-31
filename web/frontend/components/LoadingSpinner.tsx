import { Spinner } from '@shopify/polaris';
import { memo } from 'react';

export default memo(() => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Spinner
        accessibilityLabel="Loading form field"
        hasFocusableParent={false}
      />
    </div>
  );
});
