import FormStatus from '@components/FormStatus';
import { usePositions, useSave, useTranslation } from '@hooks';
import isEmail from '@libs/validators/isEmail';
import isPhoneNumber from '@libs/validators/isPhoneNumber';
import {
  BreadcrumbsProps,
  Card,
  Form,
  FormLayout,
  Image,
  Layout,
  Page,
  Select,
  TextField,
} from '@shopify/polaris';
import {
  lengthMoreThan,
  notEmpty,
  useField,
  useForm,
} from '@shopify/react-form';

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
  const { t } = useTranslation('staff', { keyPrefix: 'new' });

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors, submitting, dirty, reset } = useForm({
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
        validates: [notEmpty('position must be selexcted')],
      }),
      active: useField({
        value: data?.active || true,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      action(fieldValues);
      return { status: 'success' };
    },
  });

  const { saveBar } = useSave({
    dirty,
    reset,
    submit,
    submitting,
  });

  return (
    <Form onSubmit={submit}>
      <Page
        title={t('title')}
        breadcrumbs={breadcrumbs}
        titleMetadata={titleMetadata}>
        {saveBar}
        <Layout>
          <FormStatus
            errors={submitErrors}
            success={submitting && dirty}
            showErrors={false}
          />
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
              </Card.Section>
              {fields.avatar.value && (
                <Image source={fields.avatar.value} alt="avatar url" />
              )}
            </Card>
            <br />
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </Form>
  );
};
