import { BookingFulfillmentStatus } from "@jamalsoueidan/bsb.mongodb.types";
import { useDate } from "@jamalsoueidan/bsf.bsf-pkg";
import { useModal } from "@providers/modal";
import { Banner, Link, Modal, TextContainer } from "@shopify/polaris";
import { differenceInHours, format, formatRelative, isAfter } from "date-fns";
import da from "date-fns/locale/da";
import { useEffect } from "react";

export default ({ info, toggle }: BookingModalProductChildProps) => {
  const orderUrl = "https://" + info.shop + "/admin/orders/" + info.orderId;
  const productUrl =
    "https://" + info.shop + "/admin/products/" + info.productId;

  const { toTimeZone } = useDate();
  const { setSecondaryActions } = useModal();

  useEffect(() => {
    if (!!info.fulfillmentStatus && isAfter(new Date(info.start), new Date())) {
      setSecondaryActions([
        {
          content: "Ændre dato/tid",
          onAction: toggle,
        },
      ]);
    }

    return () => {
      setSecondaryActions(null);
    };
  }, [setSecondaryActions, info, toggle]);

  return (
    <>
      {info.fulfillmentStatus === BookingFulfillmentStatus.CANCELLED && (
        <Modal.Section>
          <Banner title="Behandling annulleret">
            <p>Dette behandling er blevet annulleret.</p>
          </Banner>
        </Modal.Section>
      )}
      {info.fulfillmentStatus === BookingFulfillmentStatus.REFUNDED && (
        <Modal.Section>
          <Banner title="Behandling refunderet" status="critical">
            <p>Dette behandling er blevet refunderet.</p>
          </Banner>
        </Modal.Section>
      )}
      {info.isEdit &&
        info.fulfillmentStatus !== BookingFulfillmentStatus.CANCELLED &&
        info.fulfillmentStatus !== BookingFulfillmentStatus.REFUNDED && (
          <Modal.Section>
            <Banner title="Behandling har skiftet dato" status="info">
              <p>Dette behandlingtid er blevet ændret.</p>
            </Banner>
          </Modal.Section>
        )}
      {info.fulfillmentStatus === BookingFulfillmentStatus.FULFILLED && (
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
      {info.fulfillmentStatus === BookingFulfillmentStatus.BOOKED && (
        <Modal.Section>
          <Banner title="Behandling er booket af medarbejder">
            <p>Dette behandling er blevet booket af medarbejder</p>
          </Banner>
        </Modal.Section>
      )}
      <Modal.Section>
        <TextContainer>
          <strong>Ordre:</strong>{" "}
          {info.orderId ? (
            <Link url={orderUrl} external>
              {info.orderId}
            </Link>
          ) : (
            "Booket af medarbejder"
          )}
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Behandling:</strong>{" "}
          <Link url={productUrl} external>
            {info.product.title}
          </Link>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Dato:</strong>{" "}
          {format(toTimeZone(info.start), "d. MMM yyyy", {
            locale: da,
          })}{" "}
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
          <strong>Tidspunkt:</strong> {format(toTimeZone(info.start), "HH:mm")}{" "}
          - {format(toTimeZone(info.end), "HH:mm")} (
          <i>
            {differenceInHours(new Date(info.end), new Date(info.start))} time)
          </i>
        </TextContainer>
      </Modal.Section>

      <Modal.Section>
        <TextContainer>
          <strong>Hos:</strong> {info.staff?.fullname}{" "}
          {info.anyAvailable && <i>(Enhver tilgængelig)</i>}
        </TextContainer>
      </Modal.Section>

      {info.timeZone && (
        <Modal.Section>
          <TextContainer>
            <strong>Tidszone:</strong> {info.timeZone}
          </TextContainer>
        </Modal.Section>
      )}

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
