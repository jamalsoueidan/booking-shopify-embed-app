import { Banner, Link, Modal, TextContainer } from '@shopify/polaris';
import { differenceInHours, format, formatRelative } from 'date-fns';
import da from 'date-fns/locale/da';

export default ({ info }: BookingModalChildProps) => {
  const orderUrl = 'https://' + info.shop + '/admin/orders/' + info.orderId;
  const productUrl =
    'https://' + info.shop + '/admin/products/' + info.productId;

  return (
    <>
      {info.fulfillmentStatus && (
        <Modal.Section>
          <Banner title="Behandling annulleret">
            <p>Dette behandling er blevet annulleret.</p>
          </Banner>
        </Modal.Section>
      )}
      {info.isEdit && !info.fulfillmentStatus && (
        <Modal.Section>
          <Banner title="Behandling har skiftet dato">
            <p>Dette behandlingtid er blevet ændret.</p>
          </Banner>
        </Modal.Section>
      )}
      <Modal.Section>
        <TextContainer>
          <strong>Ordre:</strong>{' '}
          <Link url={orderUrl} external>
            {info.orderId}
          </Link>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Behandling:</strong>{' '}
          <Link url={productUrl} external>
            {info.product.title}
          </Link>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Dato:</strong>{' '}
          {format(new Date(info.start), 'd. MMM yyyy', {
            locale: da,
          })}{' '}
          <i>
            (
            {formatRelative(new Date(info.start), new Date(), {
              locale: da,
            })}
            )
          </i>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Tidspunkt:</strong> {format(new Date(info.start), 'HH:mm')} -{' '}
          {format(new Date(info.end), 'HH:mm')} (
          <i>
            {differenceInHours(new Date(info.end), new Date(info.start))} time)
          </i>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Hos:</strong> {info.staff?.fullname}{' '}
          {info.anyAvailable && <i>(Enhver tilgængelig)</i>}
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Tidszone:</strong> {info.timeZone}
        </TextContainer>
      </Modal.Section>

      {info.lineItemTotal > 0 && (
        <Modal.Section>
          <TextContainer>
            <strong>
              Kunden har bestilt {info.lineItemTotal} behandlinger i dette
              ordre.
            </strong>
          </TextContainer>
        </Modal.Section>
      )}
    </>
  );
};
