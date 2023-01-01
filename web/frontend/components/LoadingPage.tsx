import { AlphaStack, Frame, Loading, Spinner } from '@shopify/polaris';
import { memo } from 'react';

export default memo(({ title }: { title?: string }) => {
  return (
    <Frame>
      <Loading />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        <AlphaStack align="center" gap="2">
          <Spinner accessibilityLabel="Loading" hasFocusableParent={false} />
          {title}
        </AlphaStack>
      </div>
    </Frame>
  );
});
