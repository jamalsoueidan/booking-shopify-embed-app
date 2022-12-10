import { Banner } from '@shopify/polaris';
import { FormError } from '@shopify/react-form';

interface FormErrorsProps {
  errors: FormError[];
}

export default ({ errors }: FormErrorsProps) => {
  if (errors.length > 0) {
    return (
      <Banner status="critical">
        <p>Errors</p>
        <ul>
          {errors.map(({ message }, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </Banner>
    );
  }

  return <></>;
};
