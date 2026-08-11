import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import type { Property } from "../api/types";
import { resolveMediaUrl } from "../api/client";
import { BERHAMPORE_CENTER } from "../constants/options";
import { formatCurrency } from "../utils/format";

interface PropertyMapProps {
  properties: Property[];
  userLocation?: { lat: number; lng: number } | null;
  height?: string;
}

const priceIcon = (price: number) =>
  L.divIcon({
    className: "price-marker",
    html: `<span>${formatCurrency(price).replace(".00", "")}</span>`,
    iconSize: [96, 36],
    iconAnchor: [48, 18]
  });

export const PropertyMap = ({ properties, userLocation, height = "520px" }: PropertyMapProps) => {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : properties[0]
      ? [properties[0].latitude, properties[0].longitude]
      : [BERHAMPORE_CENTER.lat, BERHAMPORE_CENTER.lng];

  return (
    <div className="map-shell" style={{ height }}>
      <MapContainer center={center as [number, number]} zoom={13} scrollWheelZoom className="map-canvas">
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
                <strong>{property.title}</strong>
                <span>{formatCurrency(property.monthlyRent)} / month</span>
                {typeof property.distanceKm === "number" && <span>{property.distanceKm} km away</span>}
                <Link to={`/properties/${property.slug}`}>View property</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
