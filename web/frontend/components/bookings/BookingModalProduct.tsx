import { Banner, Link, Modal, TextContainer } from '@shopify/polaris';
import { format } from 'date-fns';

export default ({ info }: BookingModalChildProps) => {
  const url = 'https://testeriphone.myshopify.com/admin/orders/' + info.orderId;

  return (
    <>
      {info.cancelled && (
        <Modal.Section>
          <Banner title="Behandling annulleret" onDismiss={() => {}}>
            <p>Dette behandling er blevet annulleret.</p>
          </Banner>
        </Modal.Section>
      )}
      <Modal.Section>
        <TextContainer>
          <strong>Title:</strong>{' '}
          <Link url={url} external>
            {info.product.title}
          </Link>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Tid:</strong> {format(new Date(info.start), 'HH:mm')} -{' '}
          {format(new Date(info.end), 'HH:mm')}
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Hos:</strong> {info.staff?.fullname}
          {info.anyStaff ? '(eller kan vælge frit)' : ''}
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>
            Dette ordre indeholder {info.lineItemTotal} behandlinger
          </strong>
        </TextContainer>
      </Modal.Section>
    </>
  );
};
