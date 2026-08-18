import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Property, Settings } from "../api/types";
import { resolveMediaUrl } from "../api/client";
import { formatCurrency } from "../utils/format";

interface PropertyMapProps {
  properties: Property[];
  settings?: Settings | null;
  userLocation?: { lat: number; lng: number } | null;
  height?: string;
  onViewDetails: (property: Property) => void;
}

const priceIcon = (price: number) =>
  L.divIcon({
    className: "price-marker",
    html: `<span>${formatCurrency(price)}</span>`,
    iconSize: [104, 36],
    iconAnchor: [52, 18]
  });

export const PropertyMap = ({
  properties,
  settings,
  userLocation,
  height = "620px",
  onViewDetails
}: PropertyMapProps) => {
  const mapCenter = {
    lat: Number(settings?.mapCenterLat || 23.2324),
    lng: Number(settings?.mapCenterLng || 87.8615)
  };
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : properties[0]
      ? [properties[0].latitude, properties[0].longitude]
      : [mapCenter.lat, mapCenter.lng];

  return (
    <div className="map-shell" style={{ height }}>
      <MapContainer
        center={center as [number, number]}
        zoom={Number(settings?.defaultMapZoom || 13)}
        scrollWheelZoom
        className="map-canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={9}
            pathOptions={{ color: "#8cb4ff", fillColor: "#4361ee", fillOpacity: 0.8 }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={priceIcon(property.monthlyRent)}
          >
            <Popup>
              <div className="map-popup">
                <img src={resolveMediaUrl(property.coverImage)} alt={property.title} />
                <strong>
                  {property.locality}, {property.city}
                </strong>
                <span>{formatCurrency(property.monthlyRent)} / month</span>
                <span>{property.propertyType.name}</span>
                <button type="button" onClick={() => onViewDetails(property)}>
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
