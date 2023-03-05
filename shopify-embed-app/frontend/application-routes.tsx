import { LoadingModal, LoadingPage } from "@jamalsoueidan/pkg.frontend";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Bookings = lazy(() => import("./pages/bookings"));
const BookingsCreate = lazy(() => import("./pages/bookings/new"));

const Collections = lazy(() => import("./pages/collections"));
const CollectionEmpty = lazy(() => import("./pages/collections/empty"));
const CollectionView = lazy(() => import("./pages/collections/product/[id]"));

const Settings = lazy(() => import("./pages/settings"));
const Staff = lazy(() => import("./pages/staff"));
const StaffEdit = lazy(() => import("./pages/staff/edit/[id]"));
const StaffView = lazy(() => import("./pages/staff/[id]"));
const StaffCreate = lazy(() => import("./pages/staff/new"));

const BookingModal = lazy(() =>
  import("./components/booking/booking-modal/booking-modal").then((module) => ({
    default: module.BookingModal,
  })),
);

export const ApplicationRoutes = () => (
  <Suspense fallback={<LoadingPage title="Loading page..." />}>
    <Routes>
      <Route path="/bookings/new" element={<BookingsCreate />} />
      <Route path="/bookings/*" element={<Bookings />}>
        <Route
          path=":id/*"
          element={
            <Suspense fallback={<LoadingModal />}>
              <BookingModal />
            </Suspense>
          }
        />
      </Route>
      <Route path="/collections" element={<Collections />} />
      <Route path="/collections/empty" element={<CollectionEmpty />} />
      <Route path="/collections/product/:id" element={<CollectionView />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/staff/new" element={<StaffCreate />} />
      <Route path="/staff/edit/:id" element={<StaffEdit />} />
      <Route path="/staff/:id" element={<StaffView />} />
      <Route path="*" element={<Navigate to="/bookings" replace />} />
    </Routes>
  </Suspense>
);
