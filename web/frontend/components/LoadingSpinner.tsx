import { Spinner } from '@shopify/polaris';

export default () => {
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
};
