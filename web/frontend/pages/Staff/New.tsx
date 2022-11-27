import FormStatus from '@components/FormStatus';
import useSave from '@hooks/useSave';
import isEmail from '@libs/validators/isEmail';
import isPhoneNumber from '@libs/validators/isPhoneNumber';
import { useStaffCreate } from '@services/staff';
import { useNavigate } from '@shopify/app-bridge-react';
import {
  Card,
  DropZone,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  Text,
  TextField,
  Thumbnail,
} from '@shopify/polaris';
import {
  lengthMoreThan,
  notEmpty,
  useField,
  useForm,
} from '@shopify/react-form';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const { create } = useStaffCreate();
  const { t } = useTranslation('staff', { keyPrefix: 'new' });

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors, submitting, dirty, reset } = useForm({
    fields: {
      fullname: useField({
        value: '',
        validates: [
          notEmpty('Fullname is required'),
          lengthMoreThan(3, 'Fullname must be more than 3 characters'),
        ],
      }),
      email: useField({
        value: '',
        validates: [notEmpty('Email is required'), isEmail('Invalid email')],
      }),
      phone: useField({
        value: '',
        validates: [
          notEmpty('Phone is required'),
          isPhoneNumber('Invalid phonenumber'),
        ],
      }),
      active: useField({
        value: true,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      const staff = await create(fieldValues);
      navigate(`/Staff/${staff._id}`);
      return { status: 'success' };
    },
  });

  const { saveBar } = useSave({
    dirty,
    reset,
    submit,
    submitting,
  });

  const handleDropZoneDrop = useCallback((_: File[], acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  const toggleOpenFileDialog = useCallback(
    () => setOpenFileDialog((openFileDialog) => !openFileDialog),
    []
  );

  const uploadedFiles = file && (
    <Stack vertical>
      <Stack alignment="center">
        <Thumbnail
          size="small"
          alt={file.name}
          source={window.URL.createObjectURL(file)}
        />
        <div>
          {file.name}{' '}
          <Text variant="bodySm" as="span">
            {file.size} bytes
          </Text>
        </div>
      </Stack>
    </Stack>
  );

  return (
    <Form onSubmit={submit}>
      <Page
        title={t('title')}
        breadcrumbs={[{ content: 'Staff', url: '/Staff' }]}>
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
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection title={t('image.title')}>
            <DropZone
              label="Upload profile image"
              openFileDialog={openFileDialog}
              onDrop={handleDropZoneDrop}
              onFileDialogClose={toggleOpenFileDialog}
              type="image"
              accept={'image/jpeg'}
              allowMultiple={false}>
              {uploadedFiles || <DropZone.FileUpload />}
            </DropZone>
            <Text variant="bodySm" as="span">
              Image size must be less than 300kb and ideally in square format.
            </Text>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </Form>
  );
};
