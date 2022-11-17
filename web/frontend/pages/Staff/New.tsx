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
import { useStaffCreate } from '@services/staff';

export default () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { create } = useStaffCreate();

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

  const handleSubmit = useCallback(async () => {
    /*var reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      await fetch("/api/admin/staff", {
        method: "POST",
        body: JSON.stringify({ fullname, email, phone, file: reader.result }),
        headers: { "Content-Type": "application/json" },
      });
      navigate("/Staff");
    };*/
    await create({ fullname, email, phone, active: true });
    navigate('/Staff');
  }, [fullname, phone, email, file]);

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

  return (
    <Page
      narrowWidth
      breadcrumbs={[{ content: 'Staff', url: '/Staff' }]}
      primaryAction={{ content: 'Save', onAction: () => handleSubmit() }}>
      <Layout>
        <Layout.Section oneThird>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
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
