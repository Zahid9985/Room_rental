import { useMemo, useState } from "react";
import { Bath, BedDouble, CalendarDays, Check, Home, Layers, MapPin, MessageCircle, X } from "lucide-react";
import type { Property, Settings } from "../api/types";
import { publicApi } from "../api/publicApi";
import { resolveMediaUrl } from "../api/client";
import { furnishingLabels } from "../constants/options";
import { useToast } from "../context/ToastContext";
import { formatCurrency, formatDate, humanizeEnum } from "../utils/format";
import { buildWhatsAppUrl } from "../utils/whatsapp";

interface PropertyDetailsModalProps {
  property: Property;
  settings: Settings;
  onClose: () => void;
}

const hasValue = (value: unknown) => value !== null && value !== undefined && value !== "";

export const PropertyDetailsModal = ({ property, settings, onClose }: PropertyDetailsModalProps) => {
  const { addToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(property.coverImage || property.images[0]?.url || null);
  const [tracking, setTracking] = useState(false);

  const pricing = useMemo(
    () =>
      [
        ["Monthly rent", formatCurrency(property.monthlyRent)],
        hasValue(property.securityDeposit) ? ["Security deposit", formatCurrency(property.securityDeposit)] : null,
        hasValue(property.maintenanceCharge) ? ["Maintenance", formatCurrency(property.maintenanceCharge)] : null,
        property.otherCharges ? ["Other charges", property.otherCharges] : null
      ].filter(Boolean) as string[][],
    [property]
  );

  const details = [
    ["Property type", property.propertyType.name],
    property.roomType ? ["Room type", property.roomType] : null,
    ["Furnishing", furnishingLabels[property.furnishingStatus]],
    hasValue(property.bedrooms) ? ["Bedrooms", String(property.bedrooms)] : null,
    hasValue(property.bathrooms) ? ["Bathrooms", String(property.bathrooms)] : null,
    hasValue(property.floor) ? ["Floor", property.floor === 0 ? "Ground floor" : String(property.floor)] : null,
    property.availableFrom ? ["Available from", formatDate(property.availableFrom)] : ["Availability", "Available now"],
    property.preferredTenant ? ["Preferred tenant", humanizeEnum(property.preferredTenant)] : null
  ].filter(Boolean) as string[][];

  const contactOnWhatsApp = async () => {
    setTracking(true);
    try {
      await publicApi.createEnquiry({
        propertyId: property.id,
        contactMethod: "WHATSAPP",
        source: "WhatsApp",
        message: `WhatsApp click for ${property.propertyCode}`
      });
    } catch {
      addToast("Opening WhatsApp. Contact tracking could not be saved.", "info");
    } finally {
      setTracking(false);
      window.open(buildWhatsAppUrl(property, settings), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel property-details-modal" role="dialog" aria-modal="true" aria-labelledby="property-modal-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{property.propertyCode}</p>
            <h2 id="property-modal-title">{property.title}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close property details">
            <X size={18} />
          </button>
        </div>

        <div className="modal-image-grid">
          <img className="modal-main-image" src={resolveMediaUrl(selectedImage)} alt={property.title} />
          {property.images.length > 1 && (
            <div className="modal-thumbnails">
              {property.images.map((image) => (
                <button
                  type="button"
                  key={image.id}
                  className={selectedImage === image.url ? "active" : ""}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img src={resolveMediaUrl(image.url)} alt={image.alt || property.title} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-highlight-row">
          <div>
            <span>Location</span>
            <strong>
              <MapPin size={18} />
              {property.locality}, {property.city}
            </strong>
            <small>{property.address}</small>
          </div>
          <div>
            <span>Rent</span>
            <strong>{formatCurrency(property.monthlyRent)} / month</strong>
            <small>{property.propertyType.name}</small>
          </div>
        </div>

        <div className="modal-facts">
          <span><Home size={17} /> {property.propertyType.name}</span>
          {hasValue(property.bedrooms) && <span><BedDouble size={17} /> {property.bedrooms} bedroom</span>}
          {hasValue(property.bathrooms) && <span><Bath size={17} /> {property.bathrooms} bathroom</span>}
          <span><CalendarDays size={17} /> {formatDate(property.availableFrom)}</span>
          {hasValue(property.floor) && <span><Layers size={17} /> {property.floor === 0 ? "Ground floor" : `Floor ${property.floor}`}</span>}
        </div>

        <div className="modal-section-grid">
          <section className="modal-section">
            <h3>Property information</h3>
            <div className="info-list">
              {details.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h3>Pricing</h3>
            <div className="info-list">
              {pricing.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>

        {property.amenities.length > 0 && (
          <section className="modal-section">
            <h3>Amenities</h3>
            <div className="amenity-list">
              {property.amenities.map((amenity) => (
                <span key={amenity.id}><Check size={15} /> {amenity.name}</span>
              ))}
            </div>
          </section>
        )}

        <section className="modal-section">
          <h3>Description</h3>
          <p>{property.description}</p>
        </section>

        {property.rules.length > 0 && (
          <section className="modal-section">
            <h3>Rules</h3>
            <ul className="clean-list">
              {property.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        )}

        {property.nearbyLandmarks.length > 0 && (
          <section className="modal-section">
            <h3>Nearby landmarks</h3>
            <div className="amenity-list">
              {property.nearbyLandmarks.map((landmark) => (
                <span key={landmark}>
                  <MapPin size={15} /> {landmark}
                </span>
              ))}
            </div>
          </section>
        )}

        <button type="button" className="primary-button whatsapp-modal-cta" onClick={contactOnWhatsApp} disabled={tracking}>
          <MessageCircle size={19} />
          {tracking ? "Opening WhatsApp..." : "Contact on WhatsApp"}
        </button>
      </div>
    </div>
  );
};
