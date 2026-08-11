import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { SavedPage } from "./pages/SavedPage";
import { ContactPage } from "./pages/ContactPage";
import { AboutPage, NotFoundPage, PrivacyPage, TermsPage } from "./pages/StaticPages";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminPropertiesPage } from "./pages/admin/AdminPropertiesPage";
import { AdminPropertyFormPage } from "./pages/admin/AdminPropertyFormPage";
import { AdminEnquiriesPage } from "./pages/admin/AdminEnquiriesPage";
import { AdminOwnersPage } from "./pages/admin/AdminOwnersPage";
import { AdminVisitsPage } from "./pages/admin/AdminVisitsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

export const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="explore" element={<ExplorePage />} />
      <Route path="map" element={<ExplorePage initialView="map" />} />
      <Route path="properties/:slug" element={<PropertyDetailsPage />} />
      <Route path="saved" element={<SavedPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="terms" element={<TermsPage />} />
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
        <Route path="owners" element={<AdminOwnersPage />} />
        <Route path="visits" element={<AdminVisitsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Route>
  </Routes>
);
