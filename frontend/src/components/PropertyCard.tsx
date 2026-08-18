import { MapPin } from "lucide-react";
import type { Property } from "../api/types";
import { resolveMediaUrl } from "../api/client";
import { furnishingLabels } from "../constants/options";
import { formatCurrency } from "../utils/format";

interface PropertyCardProps {
  property: Property;
  onOpen: (property: Property) => void;
}

export const PropertyCard = ({ property, onOpen }: PropertyCardProps) => (
  <button type="button" className="property-card catalogue-card" onClick={() => onOpen(property)}>
    <div className="catalogue-card-location">
      <MapPin size={17} />
      <span>
        {property.locality}, {property.city}
      </span>
    </div>
    <div className="property-card-image">
      <img src={resolveMediaUrl(property.coverImage)} alt={property.title} loading="lazy" />
      <span className="glass-badge property-code">
        {property.status === "AVAILABLE" ? "Available" : property.status}
      </span>
    </div>
    <div className="property-card-body">
      <strong className="catalogue-card-title">{property.title}</strong>
      <p className="rent-line">
        {formatCurrency(property.monthlyRent)} <span>/ month</span>
      </p>
      <p className="muted compact-line">
        {property.propertyType.name} • {property.roomType || "Room"} •{" "}
        {furnishingLabels[property.furnishingStatus]}
      </p>
      <div className="catalogue-card-footer">
        <span className="catalogue-card-code">{property.propertyCode}</span>
        <span className="view-details-cue">View details</span>
      </div>
    </div>
  </button>
);
