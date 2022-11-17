import { useNavigate } from '@shopify/app-bridge-react';
import {
  Caption,
  Card,
  DropZone,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Metadata from '@components/staff/Metadata';
import { useStaffGet, useStaffUpdate } from '@services/staff';

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: staff } = useStaffGet({ userId: params.id });
  const { update } = useStaffUpdate({ userId: params.id });

  if (!staff) {
    return <></>;
  }

  const [file, setFile] = useState<File>();
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [fullname, setFullname] = useState<string>(staff.fullname);
  const [email, setEmail] = useState<string>(staff.email);
  const [phone, setPhone] = useState(staff.phone);

  const handleDropZoneDrop = useCallback((_: File[], acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  const toggleOpenFileDialog = useCallback(
    () => setOpenFileDialog((openFileDialog) => !openFileDialog),
    []
  );

  const handleFullnameChange = useCallback(
    (value: string) => setFullname(value),
    []
  );
  const handleEmailChange = useCallback((value: string) => setEmail(value), []);
  const handlePhoneChange = useCallback((value: string) => setPhone(value), []);

  const handleSubmit = useCallback(
    async (active = false) => {
      await update({ fullname, email, phone, active });
      navigate('/Staff/' + staff._id);
    },
    [fullname, phone, email, file]
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
          {file.name} <Caption>{file.size} bytes</Caption>
        </div>
      </Stack>
    </Stack>
  );

  const { _id, active } = staff;
  return (
    <Page
      narrowWidth
      breadcrumbs={[{ content: 'Staff', url: '/Staff/' + _id }]}
      title={staff.fullname}
      titleMetadata={<Metadata active={active} />}
      secondaryActions={[
        {
          content: active ? 'Deactive' : 'Active',
          onAction: () => handleSubmit(!active),
        },
      ]}
      primaryAction={{ content: 'Save', onAction: () => handleSubmit(true) }}>
      <Layout>
        <Layout.Section oneThird>
          <Card sectioned>
            <Form onSubmit={() => handleSubmit(true)}>
              <FormLayout>
                <TextField
                  value={fullname}
                  onChange={handleFullnameChange}
                  label="Full name"
                  type="text"
                  autoComplete="fullname"
                  placeholder="Example: Kristina Larsen"
                />
                <TextField
                  value={email}
                  onChange={handleEmailChange}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="Example: kristina.larsen@gmail.com"
                  helpText={
                    <span>
                      We’ll use this email address to inform you about future
                      appointments.
                    </span>
                  }
                />
                <TextField
                  value={phone}
                  onChange={handlePhoneChange}
                  label="Phone number"
                  type="text"
                  autoComplete="phone"
                  placeholder="Example: +4531311234"
                  helpText={
                    <span>
                      We’ll use this phone number to inform you about future
                      appointments.
                    </span>
                  }
                />
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
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
          <TextStyle variation="subdued">
            Image size must be less than 300kb and ideally in square format.
          </TextStyle>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
