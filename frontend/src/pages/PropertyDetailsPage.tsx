import { useEffect, useMemo, useState } from "react";
import { Bath, BedDouble, Calendar, Heart, IndianRupee, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getApiMessage, resolveMediaUrl } from "../api/client";
import { publicApi } from "../api/publicApi";
import type { Property } from "../api/types";
import { EnquiryModal } from "../components/EnquiryModal";
import { EmptyState } from "../components/EmptyState";
import { PropertyMap } from "../components/PropertyMap";
import { furnishingLabels } from "../constants/options";
import { useToast } from "../context/ToastContext";
import { useSavedProperties } from "../hooks/useSavedProperties";
import { formatCurrency, formatDate, humanizeEnum } from "../utils/format";

export const PropertyDetailsPage = () => {
  const { slug } = useParams();
  const { addToast } = useToast();
  const { isSaved, toggleSaved } = useSavedProperties();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    publicApi
      .propertyDetails(slug)
      .then((item) => {
        setProperty(item);
        setSelectedImage(item.coverImage || item.images[0]?.url || null);
      })
      .catch((apiError) => setError(getApiMessage(apiError)))
      .finally(() => setLoading(false));
  }, [slug]);

  const financials = useMemo(
    () =>
      property
        ? [
            ["Monthly rent", formatCurrency(property.monthlyRent)],
            ["Security deposit", formatCurrency(property.securityDeposit)],
            ["Maintenance", formatCurrency(property.maintenanceCharge)],
            ["Additional charges", property.otherCharges || "None listed"]
          ]
        : [],
    [property]
  );

  if (loading) return <section className="detail-page"><div className="skeleton-detail" /></section>;
  if (error || !property) {
    return (
      <section className="detail-page">
        <EmptyState title="Property unavailable" message={error || "The room you opened could not be found."} />
      </section>
    );
  }

  return (
    <section className="detail-page">
      <div className="detail-grid">
        <div className="detail-media">
          <img src={resolveMediaUrl(selectedImage)} alt={property.title} className="detail-main-image" />
          <div className="thumbnail-row">
            {property.images.map((image) => (
              <button
                type="button"
                className={selectedImage === image.url ? "active" : ""}
                key={image.id}
                onClick={() => setSelectedImage(image.url)}
              >
                <img src={resolveMediaUrl(image.url)} alt={image.alt || property.title} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-panel">
          <div className="detail-title-row">
            <div>
              <p className="eyebrow">{property.propertyCode}</p>
              <h1>{property.title}</h1>
            </div>
            <button
              className={`icon-button save-button ${isSaved(property.id) ? "active" : ""}`}
              aria-label={isSaved(property.id) ? "Remove saved property" : "Save property"}
              onClick={() => {
                toggleSaved(property);
                addToast(isSaved(property.id) ? "Removed from saved." : "Saved property.", "success");
              }}
            >
              <Heart size={20} fill={isSaved(property.id) ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="detail-rent">{formatCurrency(property.monthlyRent)} <span>/ month</span></p>
          <p className="location-line">
            <MapPin size={17} />
            {property.address}
          </p>

          <div className="detail-facts">
            <span><BedDouble size={18} /> {property.bedrooms || 1} bedroom</span>
            <span><Bath size={18} /> {property.bathrooms || 1} bathroom</span>
            <span><Calendar size={18} /> {formatDate(property.availableFrom)}</span>
            <span><ShieldCheck size={18} /> {property.verified ? "Verified" : "Unverified"}</span>
          </div>

          <div className="pill-row">
            <span>{property.propertyType.name}</span>
            <span>{property.roomType || "Room"}</span>
            <span>{furnishingLabels[property.furnishingStatus]}</span>
            <span>{humanizeEnum(property.preferredTenant)}</span>
          </div>

          <p className="description-text">{property.description}</p>

          <div className="section-card">
            <h2>Amenities</h2>
            <div className="amenity-list">
              {property.amenities.map((amenity) => (
                <span key={amenity.id}>{amenity.name}</span>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h2>Financials</h2>
            <div className="info-grid">
              {financials.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <button className="primary-button sticky-contact" onClick={() => setShowEnquiry(true)}>
            <Phone size={18} />
            Contact / Enquire
          </button>
        </div>
      </div>

      <div className="detail-lower-grid">
        <div className="section-card">
          <h2>Rules</h2>
          <ul className="clean-list">
            {property.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </div>
        <div className="section-card">
          <h2>Nearby places</h2>
          <ul className="clean-list">
            {property.nearbyLandmarks.map((landmark) => <li key={landmark}>{landmark}</li>)}
          </ul>
        </div>
      </div>

      <section className="content-band no-pad-top">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Map</p>
            <h2>Property location</h2>
          </div>
          <Link to="/map">Open map search</Link>
        </div>
        <PropertyMap properties={[property]} height="420px" />
      </section>

      {showEnquiry && <EnquiryModal property={property} onClose={() => setShowEnquiry(false)} />}
    </section>
  );
};
