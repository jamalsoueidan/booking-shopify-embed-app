import { AlphaStack, Spinner, Text } from '@shopify/polaris';
import { memo } from 'react';

export default memo(() => {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          backgroundColor: '#e9e9e9',
          opacity: '.6',
          top: '0px',
          bottom: '0px',
          right: '0px',
          left: '0px',
          zIndex: 5,
        }}></div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 6,
        }}>
        <AlphaStack align="center" gap="2">
          <Spinner accessibilityLabel="Loading" hasFocusableParent={false} />
          <Text variant="bodySm" as="span">
            Loading modal...
          </Text>
        </AlphaStack>
      </div>
    </>
  );
});
