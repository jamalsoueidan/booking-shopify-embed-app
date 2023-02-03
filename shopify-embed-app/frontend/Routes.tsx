import { LoadingPage } from "@jamalsoueidan/bsf.bsf-pkg";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Settings = lazy(() => import("./pages/settings"));
const Staff = lazy(() => import("./pages/staff"));
const StaffEdit = lazy(() => import("./pages/staff/edit/[id]"));
const StaffView = lazy(() => import("./pages/staff/[id]"));
const StaffCreate = lazy(() => import("./pages/staff/new"));

export default () => (
  <Suspense fallback={<LoadingPage title="Loading page..." />}>
    <Routes>
      <Route path="/settings" element={<Settings />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/staff/new" element={<StaffCreate />} />
      <Route path="/staff/edit/:id" element={<StaffEdit />} />
      <Route path="/staff/:id" element={<StaffView />} />
      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  </Suspense>
);
