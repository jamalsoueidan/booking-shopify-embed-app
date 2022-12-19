import { useNavigate } from '@shopify/app-bridge-react';
import { Card, EmptyState, Page } from '@shopify/polaris';
import { useTranslation } from '@hooks';

export default ({}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('staff', { keyPrefix: 'empty' });

  const props = { onAction: () => navigate('/Staff/New') };

  return (
    <Page title={t('title')}>
      <Card sectioned>
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading={t('heading')}
          action={{
            content: t('add'),
            ...props,
          }}>
          <p>{t('text')}</p>
        </EmptyState>
      </Card>
    </Page>
  );
};
