import { LoadingSpinner } from "@jamalsoueidan/bsf.bsf-pkg";
import { ModalProvider } from "@providers/modal";
import { useBookingGet } from "@services/booking";
import { Card, Tabs } from "@shopify/polaris";
import { useCallback, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookingCustomer } from "../booking-details/booking-customer";
import { BookingDetailsEdit } from "../booking-details/booking-details-edit";
import { BookingDetailsView } from "../booking-details/booking-details-view";
import { BookingNotifications } from "../booking-details/booking-notifications";

export const BookingModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string; "*": string }>();

  const { data } = useBookingGet({ id: params.id });

  const onClose = useCallback(() => {
    navigate("../", { relative: "route" });
  }, [navigate]);

  const tabs = useMemo(() => {
    const t = [
      {
        content: "Behandling",
        id: null,
      },
      {
        content: "Kunde",
        id: "customer",
      },
      {
        content: "Meddelelser",
        id: "notifications",
      },
    ];

    return t;
  }, []);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => {
      navigate(tabs[selectedTabIndex].id || "", {
        relative: "route",
        state: tabs[selectedTabIndex].id,
      });
    },
    [navigate, tabs],
  );

  const selected = useMemo(() => tabs.findIndex((t) => t.id === location.state), [tabs, location]);

  return (
    <ModalProvider large open={true} onClose={onClose} title={data?.title}>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {!data ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route index element={<BookingDetailsView booking={data} />} />
              <Route path="edit" element={<BookingDetailsEdit booking={data} />} />
              <Route path="customer" element={<BookingCustomer booking={data} />} />
              <Route path="notifications" element={<BookingNotifications booking={data} />} />
            </Routes>
          )}
        </Tabs>
      </Card>
    </ModalProvider>
  );
};
