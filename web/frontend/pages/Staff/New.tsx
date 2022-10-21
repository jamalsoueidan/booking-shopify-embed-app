import {
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks";

export default () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const fetch = useAuthenticatedFetch();

  const handleFullnameChange = useCallback((value) => setFullname(value), []);
  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const handlePhoneChange = useCallback((value) => setPhone(value), []);

  const handleSubmit = useCallback(async () => {
    const response = await fetch("/api/admin/collections/update", {
      method: "POST",
      body: JSON.stringify({ fullname, email, phone }),
      headers: { "Content-Type": "application/json" },
    });
    const { payload } = await response.json();
    //updateCollections(payload);
  }, []);

  return (
    <Page
      narrowWidth
      breadcrumbs={[{ content: "Staff", url: "/Staff" }]}
      primaryAction={{ content: "Save", onAction: () => handleSubmit() }}
    >
      <Layout>
        <Layout.Section>
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
      </Layout>
    </Page>
  );
};
