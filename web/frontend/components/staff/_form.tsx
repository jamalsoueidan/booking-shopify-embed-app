import { FormErrors } from '@components/FormErrors';
import { useExtendForm, usePositions, useTranslation } from '@hooks';
import isEmail from '@libs/validators/isEmail';
import isPhoneNumber from '@libs/validators/isPhoneNumber';
import { useToast } from '@providers/toast';
import {
  Box,
  BreadcrumbsProps,
  Card,
  Form,
  FormLayout,
  Image,
  Layout,
  Page,
  PageActions,
  Select,
  TextField,
} from '@shopify/polaris';
import { lengthMoreThan, notEmpty, useField } from '@shopify/react-form';

interface StaffFormProps {
  action: (body: StaffBodyUpdate) => void;
  breadcrumbs?: BreadcrumbsProps['breadcrumbs'];
  titleMetadata?: React.ReactNode;
  data?: Staff;
}

export const StaffForm = ({
  action,
  breadcrumbs,
  titleMetadata,
  data,
}: StaffFormProps) => {
  const { options } = usePositions();
  const { show } = useToast();
  const { t } = useTranslation('staff', { keyPrefix: 'form' });

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors, primaryAction } = useExtendForm({
    fields: {
      fullname: useField({
        value: data?.fullname || '',
        validates: [
          notEmpty('Fullname is required'),
          lengthMoreThan(3, 'Fullname must be more than 3 characters'),
        ],
      }),
      email: useField({
        value: data?.email || '',
        validates: [notEmpty('Email is required'), isEmail('Invalid email')],
      }),
      phone: useField({
        value: data?.phone || '',
        validates: [
          notEmpty('Phone is required'),
          isPhoneNumber('Invalid phonenumber'),
        ],
      }),
      avatar: useField({
        value: data?.avatar || '',
        validates: [notEmpty('avatarUrl is required')],
      }),
      position: useField({
        value: data?.position || options[0].value,
        validates: [notEmpty('position must be selected')],
      }),
      postal: useField<number>({
        value: data?.postal || undefined,
        validates: [notEmpty('postal must be filled')],
      }),
      address: useField({
        value: data?.address || '',
        validates: [notEmpty('postal must be filled')],
      }),
      active: useField({
        value: data?.active || true,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      action(fieldValues);
      show({ content: data ? 'Staff has been updated' : 'Staff created' });
      return { status: 'success' };
    },
  });

  return (
    <Form onSubmit={submit}>
      <Page
        fullWidth
        title={data ? data?.fullname : t('title')}
        breadcrumbs={breadcrumbs}
        titleMetadata={titleMetadata}>
        <Layout>
          <FormErrors errors={submitErrors} />
          <Layout.AnnotatedSection title={t('staff.title')}>
            <Card sectioned>
              <FormLayout>
                <TextField
                  label={t('staff.fullname.label')}
                  type="text"
                  autoComplete="fullname"
                  placeholder={t('staff.fullname.placeholder')}
                  {...fields.fullname}
                />
                <TextField
                  label={t('staff.email.label')}
                  type="email"
                  autoComplete="email"
                  placeholder={t('staff.email.placeholder')}
                  helpText={<span>{t('staff.email.help')}</span>}
                  {...fields.email}
                />
                <TextField
                  label={t('staff.phone.label')}
                  type="text"
                  autoComplete="phone"
                  placeholder={t('staff.phone.placeholder')}
                  helpText={<span>{t('staff.phone.help')}</span>}
                  {...fields.phone}
                />
                <TextField
                  label={t('staff.address.label')}
                  type="text"
                  autoComplete="address"
                  placeholder={t('staff.address.placeholder')}
                  {...fields.address}
                />
                <TextField
                  label={t('staff.postal.label')}
                  type="text"
                  autoComplete="postal"
                  placeholder={t('staff.postal.placeholder')}
                  helpText={<span>{t('staff.postal.help')}</span>}
                  {...fields.postal}
                  value={fields.postal?.value?.toString()}
                  onChange={(value: string) =>
                    fields.postal.onChange(parseInt(value))
                  }
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection title={t('staff.position.title')}>
            <Card sectioned>
              <FormLayout>
                <Select
                  label={t('staff.position.label')}
                  options={options}
                  {...fields.position}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection title={t('image.title')}>
            <Card>
              <Card.Section>
                <TextField
                  label={t('staff.avatarUrl.label')}
                  type="text"
                  autoComplete="avatarUrl"
                  placeholder={t('staff.avatarUrl.placeholder')}
                  helpText={<span>{t('staff.avatarUrl.help')}</span>}
                  {...fields.avatar}
                />
                {fields.avatar.value && (
                  <Box paddingBlockStart="4">
                    <Image
                      source={fields.avatar.value}
                      alt="avatar url"
                      width="100px"
                    />
                  </Box>
                )}
              </Card.Section>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};
