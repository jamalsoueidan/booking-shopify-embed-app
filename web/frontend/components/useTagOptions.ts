import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface UseTagOptionsReturn {
  label: string;
  value: string;
}

export default (): UseTagOptionsReturn[] => {
  const { t } = useTranslation('tags');

  return useMemo(
    () => [
      { label: t('everyday'), value: '#4b6043' },
      { label: t('weekend'), value: '#235284' },
      { label: t('all'), value: '#d24e01' },
      { label: t('end'), value: '#2980B9' },
      { label: t('start'), value: '#8E44AD' },
      { label: t('middle'), value: '#A93226' },
    ],
    []
  );
};
