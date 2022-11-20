import {
  Text,
  Link,
  Modal,
  Stack,
  TextContainer,
  Banner,
} from '@shopify/polaris';
import { format, formatDistance, formatRelative } from 'date-fns';

interface BookingModal {
  show: boolean;
  toggle: any;
  info: Info.Data;
}

declare module Info {
  export interface Staff {
    _id: string;
    shop: string;
    fullname: string;
    email: string;
    phone: string;
    active: boolean;
    __v: number;
  }

  export interface Customer {
    _id: string;
    customerId: number;
    shop: string;
    __v: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: any;
  }

  export interface Staff2 {
    staff: string;
    tag: string;
    _id: string;
  }

  export interface Product {
    _id: string;
    productId: number;
    active: boolean;
    buffertime: number;
    collectionId: number;
    duration: number;
    shop: string;
    staff: Staff2[];
    title: string;
  }

  export interface Data {
    _id: string;
    productId: number;
    orderId: number;
    customerId: number;
    staff: Staff;
    shop: string;
    anyStaff: boolean;
    cancelled: boolean;
    __v: number;
    customer: Customer;
    product: Product;
    start: string;
    end: string;
  }
}

export default ({ show, toggle, info }: BookingModal) => {
  const close = () => {
    toggle(null);
  };

  const url = 'https://testeriphone.myshopify.com/admin/orders/' + info.orderId;

  return (
    <Modal
      small
      open={show}
      onClose={close}
      title={info.product.title}
      primaryAction={{
        content: 'Close',
        onAction: close,
      }}>
      <Modal.Section>
        <Stack vertical>
          {info.cancelled && (
            <Stack.Item>
              <Banner title="Behandling annulleret" onDismiss={() => {}}>
                <p>Dette behandling er blevet annulleret.</p>
              </Banner>
            </Stack.Item>
          )}
          <Stack.Item>
            <TextContainer>
              <Text variant="headingMd" as="h6">
                Behandling:
              </Text>
              <strong>Title:</strong> {info.product.title} <br />
              <strong>Tid:</strong> {format(new Date(info.start), 'HH:mm')} -{' '}
              {format(new Date(info.end), 'HH:mm')}
              <br />
              <strong>Hos:</strong> {info.staff.fullname}
              {info.anyStaff ? '(eller kan vælge frit)' : ''}
            </TextContainer>
          </Stack.Item>

          <Stack.Item>
            <TextContainer>
              <Text variant="headingMd" as="h6">
                Kunde information:
              </Text>
              <strong>Fuldenavn:</strong> {info.customer.firstName}{' '}
              {info.customer.lastName}
              <br />
              <strong>email:</strong> {info.customer.email || '-'}
              <br />
              <strong>mobil:</strong> {info.customer.phone || '-'}
            </TextContainer>
          </Stack.Item>

          <Stack.Item>
            <Link url={url} external>
              Order side
            </Link>
          </Stack.Item>
        </Stack>
      </Modal.Section>
    </Modal>
  );
};
