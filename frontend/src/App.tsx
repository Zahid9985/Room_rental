import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/StaticPages";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminPropertiesPage } from "./pages/admin/AdminPropertiesPage";
import { AdminPropertyFormPage } from "./pages/admin/AdminPropertyFormPage";
import { AdminEnquiriesPage } from "./pages/admin/AdminEnquiriesPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

export const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="map" element={<MapPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    <Route path="admin/login" element={<AdminLoginPage />} />
    <Route path="admin" element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="properties/new" element={<AdminPropertyFormPage />} />
        <Route path="properties/:id/edit" element={<AdminPropertyFormPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Route>
  </Routes>
);
