import { useNavigate } from '@shopify/app-bridge-react';
import {
  Badge,
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
import useSWR, { useSWRConfig } from 'swr';
import Metadata from '../../../components/staff/Metadata';
import { useAuthenticatedFetch } from '../../../hooks';

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const { mutate } = useSWRConfig();
  const { data: staff } = useSWR<StaffApi>(
    `/api/admin/staff/${params.id}`,
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  if (!staff) {
    return <></>;
  }

  const [file, setFile] = useState<File>();
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [fullname, setFullname] = useState<string>(staff.payload.fullname);
  const [email, setEmail] = useState<string>(staff.payload.email);
  const [phone, setPhone] = useState(staff.payload.phone);
  const fetch = useAuthenticatedFetch();

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
      await fetch('/api/admin/staff/' + params.id, {
        method: 'PUT',
        body: JSON.stringify({ fullname, email, phone, active }),
        headers: { 'Content-Type': 'application/json' },
      });
      await mutate(`/api/admin/staff/${params.id}`);
      navigate('/Staff/' + staff.payload._id);
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

  const { _id, active } = staff.payload;
  return (
    <Page
      narrowWidth
      breadcrumbs={[{ content: 'Staff', url: '/Staff/' + _id }]}
      title={staff.payload.fullname}
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
