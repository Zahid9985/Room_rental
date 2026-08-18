import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getApiMessage } from "../api/client";
import { publicApi } from "../api/publicApi";
import type { Settings } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../context/ToastContext";
import { buildWhatsAppUrl } from "../utils/whatsapp";

export const ContactPage = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .settings()
      .then(setSettings)
      .catch((apiError) => {
        const message = getApiMessage(apiError);
        setError(message);
        addToast(message, "error");
      });
  }, [addToast]);

  if (error) {
    return (
      <section className="content-band page-band">
        <EmptyState title="Contact details are unavailable" message={error} />
      </section>
    );
  }

  return (
    <section className="content-band page-band contact-page">
      <div className="contact-hero">
        <p className="eyebrow">{settings?.operatingCity || settings?.serviceCity || "Contact"}</p>
        <h1>{settings?.businessName || "SS Room Rentals"}</h1>
        <p>Looking for a room? Contact us and we will help you find a suitable property.</p>
        <div className="hero-actions">
          {settings?.contactPhone && (
            <a className="primary-button" href={`tel:${settings.contactPhone}`}>
              <Phone size={18} /> Call Now
            </a>
          )}
          {settings && (
            <a className="secondary-button" href={buildWhatsAppUrl(null, settings)} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="contact-grid">
        <div className="section-card">
          <Phone size={24} />
          <h2>Phone</h2>
          <a href={`tel:${settings?.contactPhone || ""}`}>{settings?.contactPhone || "Not configured"}</a>
        </div>
        <div className="section-card">
          <MessageCircle size={24} />
          <h2>WhatsApp</h2>
          {settings ? <a href={buildWhatsAppUrl(null, settings)} target="_blank" rel="noreferrer">Message now</a> : <span>Loading...</span>}
        </div>
        <div className="section-card">
          <Mail size={24} />
          <h2>Email</h2>
          {settings?.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : <span>Not configured</span>}
        </div>
        <div className="section-card">
          <MapPin size={24} />
          <h2>Office</h2>
          <span>{settings?.address || settings?.operatingCity || "Not configured"}</span>
        </div>
        <div className="section-card">
          <Clock size={24} />
          <h2>Hours</h2>
          <span>{settings?.businessHours || "Not configured"}</span>
        </div>
      </div>
    </section>
  );
};
