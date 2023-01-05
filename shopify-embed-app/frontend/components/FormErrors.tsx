import { Banner } from '@shopify/polaris';
import { FormError } from '@shopify/react-form';

interface FormErrorsProps {
  errors: FormError[];
}

export const FormErrors = ({ errors }: FormErrorsProps) => {
  if (errors.length > 0) {
    return (
      <Banner status="critical">
        <p>Errors</p>
        <ul>
          {errors.map(({ message }, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </Banner>
    );
  }

  return <></>;
};
