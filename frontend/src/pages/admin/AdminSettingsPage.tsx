import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { getApiMessage } from "../../api/client";
import type { Settings } from "../../api/types";
import { useToast } from "../../context/ToastContext";

export const AdminSettingsPage = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    businessName: "SS Room Rentals",
    contactPhone: "",
    whatsappNumber: "",
    serviceCity: "Berhampore",
    defaultSearchRadiusKm: "5"
  });

  useEffect(() => {
    adminApi.settings().then(setSettings).catch((error) => addToast(getApiMessage(error), "error"));
  }, [addToast]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, String(value)]));
      setSettings(await adminApi.updateSettings(payload));
      addToast("Settings updated.", "success");
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><div><p className="eyebrow">Settings</p><h1>Business contact settings</h1></div></div>
      <form className="admin-panel stacked-form settings-form" onSubmit={submit}>
        <label className="field"><span>Business name</span><input value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} /></label>
        <label className="field"><span>Contact phone</span><input value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} /></label>
        <label className="field"><span>WhatsApp number</span><input value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} /></label>
        <label className="field"><span>Service city</span><input value={settings.serviceCity} onChange={(e) => setSettings({ ...settings, serviceCity: e.target.value })} /></label>
        <label className="field"><span>Default radius km</span><input type="number" value={settings.defaultSearchRadiusKm} onChange={(e) => setSettings({ ...settings, defaultSearchRadiusKm: e.target.value })} /></label>
        <button className="primary-button"><Save size={18} /> Save settings</button>
      </form>
    </section>
  );
};
