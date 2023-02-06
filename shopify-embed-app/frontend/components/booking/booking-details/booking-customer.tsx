import { BookingResponse } from "@jamalsoueidan/bsb.types";
import { Link, Modal, TextContainer } from "@shopify/polaris";
import { memo } from "react";

export const BookingCustomer = memo(
  ({ booking }: { booking: BookingResponse }) => {
    const url =
      "https://testeriphone.myshopify.com/admin/customers/" +
      booking.customerId;

    return (
      <>
        <Modal.Section>
          <TextContainer>
            <strong>Fuldenavn:</strong>{" "}
            <Link url={url} external>
              {booking.customer.firstName} {booking.customer.lastName}
            </Link>
          </TextContainer>
        </Modal.Section>
        <Modal.Section>
          <TextContainer>
            <strong>email:</strong> {booking.customer.email || "-"}
          </TextContainer>
        </Modal.Section>
        <Modal.Section>
          <TextContainer>
            <strong>mobil:</strong> {booking.customer.phone || "-"}
          </TextContainer>
        </Modal.Section>
      </>
    );
  }
);
