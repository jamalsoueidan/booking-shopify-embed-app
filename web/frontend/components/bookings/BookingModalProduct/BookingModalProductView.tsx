import { FulfillmentStatus, useDate } from '@hooks';
import { Banner, Link, Modal, TextContainer } from '@shopify/polaris';
import { differenceInHours, format, formatRelative } from 'date-fns';
import da from 'date-fns/locale/da';

export default ({ info }: BookingModalChildProps) => {
  const orderUrl = 'https://' + info.shop + '/admin/orders/' + info.orderId;
  const productUrl =
    'https://' + info.shop + '/admin/products/' + info.productId;

  const { toTimeZone } = useDate();

  return (
    <>
      {info.fulfillmentStatus === FulfillmentStatus.CANCELLED && (
        <Modal.Section>
          <Banner title="Behandling annulleret">
            <p>Dette behandling er blevet annulleret.</p>
          </Banner>
        </Modal.Section>
      )}
      {info.fulfillmentStatus === FulfillmentStatus.REFUNDED && (
        <Modal.Section>
          <Banner title="Behandling refunderet" status="critical">
            <p>Dette behandling er blevet refunderet.</p>
          </Banner>
        </Modal.Section>
      )}
      {info.isEdit &&
        info.fulfillmentStatus !== FulfillmentStatus.CANCELLED &&
        info.fulfillmentStatus !== FulfillmentStatus.REFUNDED && (
          <Modal.Section>
            <Banner title="Behandling har skiftet dato" status="info">
              <p>Dette behandlingtid er blevet ændret.</p>
            </Banner>
          </Modal.Section>
        )}
      {info.fulfillmentStatus === FulfillmentStatus.FULFILLED && (
        <Modal.Section>
          <Banner title="Behandling er gennemført" status="success">
            <p>Dette behandling er blevet gennemført.</p>
          </Banner>
        </Modal.Section>
      )}
      {!info.fulfillmentStatus && (
        <Modal.Section>
          <Banner title="Behandling ikke gennemført" status="warning">
            <p>Dette behandling er stadig ikke gennemført.</p>
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
          {format(toTimeZone(info.start), 'd. MMM yyyy', {
            locale: da,
          })}{' '}
          <i>
            (
            {formatRelative(toTimeZone(info.start), new Date(), {
              locale: da,
            })}
            )
          </i>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Tidspunkt:</strong> {format(toTimeZone(info.start), 'HH:mm')}{' '}
          - {format(toTimeZone(info.end), 'HH:mm')} (
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
