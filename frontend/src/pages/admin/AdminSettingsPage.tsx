import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { getApiMessage } from "../../api/client";
import type { Settings } from "../../api/types";
import { useToast } from "../../context/ToastContext";

const defaultSettings: Settings = {
  businessName: "SS Room Rentals",
  contactPerson: "",
  contactPhone: "",
  whatsappNumber: "",
  email: "",
  address: "",
  businessHours: "",
  operatingCity: "Bardhaman / Burdwan",
  mapCenterLat: "23.2324",
  mapCenterLng: "87.8615",
  defaultMapZoom: "13",
  websiteName: "SS Room Rentals",
  shortTagline: "Discover available rooms near you.",
  defaultSearchRadiusKm: "20",
  serviceCity: "Bardhaman / Burdwan"
};

export const AdminSettingsPage = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    adminApi.settings().then((data) => setSettings({ ...defaultSettings, ...data })).catch((error) => addToast(getApiMessage(error), "error"));
  }, [addToast]);

  const update = (key: keyof Settings, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, String(value ?? "")]));
      const updated = await adminApi.updateSettings(payload);
      setSettings({ ...defaultSettings, ...updated });
      addToast("Settings updated.", "success");
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Business, map, and website settings</h1>
        </div>
      </div>
      <form className="admin-form-grid settings-form-wide" onSubmit={submit}>
        <div className="admin-panel form-section">
          <h2>Business</h2>
          <label className="field"><span>Business name</span><input value={settings.businessName} onChange={(e) => update("businessName", e.target.value)} /></label>
          <label className="field"><span>Contact person</span><input value={settings.contactPerson || ""} onChange={(e) => update("contactPerson", e.target.value)} /></label>
          <label className="field"><span>Phone</span><input value={settings.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} /></label>
          <label className="field"><span>WhatsApp number</span><input value={settings.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} /></label>
          <label className="field"><span>Email</span><input type="email" value={settings.email || ""} onChange={(e) => update("email", e.target.value)} /></label>
          <label className="field"><span>Address</span><textarea rows={3} value={settings.address || ""} onChange={(e) => update("address", e.target.value)} /></label>
          <label className="field"><span>Business hours</span><input value={settings.businessHours || ""} onChange={(e) => update("businessHours", e.target.value)} /></label>
        </div>

        <div className="admin-panel form-section">
          <h2>Map</h2>
          <label className="field"><span>Operating city</span><input value={settings.operatingCity || ""} onChange={(e) => update("operatingCity", e.target.value)} /></label>
          <div className="split-fields">
            <label className="field"><span>Center latitude</span><input type="number" step="any" value={settings.mapCenterLat || ""} onChange={(e) => update("mapCenterLat", e.target.value)} /></label>
            <label className="field"><span>Center longitude</span><input type="number" step="any" value={settings.mapCenterLng || ""} onChange={(e) => update("mapCenterLng", e.target.value)} /></label>
          </div>
          <label className="field"><span>Default zoom</span><input type="number" min="1" max="20" value={settings.defaultMapZoom || "13"} onChange={(e) => update("defaultMapZoom", e.target.value)} /></label>
        </div>

        <div className="admin-panel form-section">
          <h2>Website</h2>
          <label className="field"><span>Website name</span><input value={settings.websiteName || ""} onChange={(e) => update("websiteName", e.target.value)} /></label>
          <label className="field"><span>Short tagline</span><input value={settings.shortTagline || ""} onChange={(e) => update("shortTagline", e.target.value)} /></label>
          <label className="field"><span>Default search radius km</span><input type="number" value={settings.defaultSearchRadiusKm} onChange={(e) => update("defaultSearchRadiusKm", e.target.value)} /></label>
        </div>

        <div className="form-actions">
          <button className="primary-button">
            <Save size={18} /> Save settings
          </button>
        </div>
      </form>
    </section>
  );
};
