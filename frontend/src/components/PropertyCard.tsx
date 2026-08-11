import { Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { Property } from "../api/types";
import { resolveMediaUrl } from "../api/client";
import { furnishingLabels } from "../constants/options";
import { formatCurrency } from "../utils/format";

interface PropertyCardProps {
  property: Property;
  saved?: boolean;
  onToggleSaved?: (property: Property) => void;
}

export const PropertyCard = ({ property, saved = false, onToggleSaved }: PropertyCardProps) => (
  <article className="property-card">
    <Link to={`/properties/${property.slug}`} className="property-card-image">
      <img src={resolveMediaUrl(property.coverImage)} alt={property.title} loading="lazy" />
      <span className="glass-badge property-code">{property.propertyCode}</span>
      {property.verified && (
        <span className="glass-badge verified-badge">
          <ShieldCheck size={14} /> Verified
        </span>
      )}
    </Link>
    <div className="property-card-body">
      <div className="property-card-topline">
        <p className="rent-line">{formatCurrency(property.monthlyRent)} <span>/ month</span></p>
        <button
          type="button"
          className={`icon-button save-button ${saved ? "active" : ""}`}
          aria-label={saved ? "Remove saved property" : "Save property"}
          onClick={() => onToggleSaved?.(property)}
          title={saved ? "Remove from saved" : "Save property"}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <Link to={`/properties/${property.slug}`} className="property-title">
        {property.title}
      </Link>
      <p className="muted compact-line">
        {property.propertyType.name} • {property.roomType || furnishingLabels[property.furnishingStatus]} •{" "}
        {furnishingLabels[property.furnishingStatus]}
      </p>
      <p className="location-line">
        <MapPin size={15} />
        {property.locality}, {property.city}
      </p>
      <div className="card-meta-row">
        {typeof property.distanceKm === "number" && <span>{property.distanceKm} km away</span>}
        <span>{property.amenities.slice(0, 3).map((amenity) => amenity.name).join(" • ")}</span>
      </div>
      {property.featured && (
        <span className="accent-chip">
          <Sparkles size={14} /> Featured
        </span>
      )}
    </div>
  </article>
);
