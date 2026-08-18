import { useEffect, useState } from "react";
import { LocateFixed } from "lucide-react";
import { getApiMessage } from "../api/client";
import { publicApi } from "../api/publicApi";
import type { Property, Settings } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { PropertyDetailsModal } from "../components/PropertyDetailsModal";
import { PropertyMap } from "../components/PropertyMap";
import { useToast } from "../context/ToastContext";
import { useGeolocation } from "../hooks/useGeolocation";

export const MapPage = () => {
  const { addToast } = useToast();
  const { coords, status, error, requestLocation } = useGeolocation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      publicApi.settings(),
      publicApi.listProperties({ limit: 100, sort: "recent" })
    ])
      .then(([settingsData, propertyResult]) => {
        setSettings(settingsData);
        setProperties(propertyResult.items.filter((property) => property.latitude && property.longitude));
      })
      .catch((error) => setErrorMessage(getApiMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status === "denied" && error) addToast(error, "info");
  }, [status, error, addToast]);

  return (
    <section className="map-page">
      <div className="map-page-heading">
        <div>
          <p className="eyebrow">{settings?.operatingCity || "Map"}</p>
          <h1>Room Map</h1>
          <p>Browse available rooms by their saved map location.</p>
        </div>
        <button className="primary-button" onClick={requestLocation} disabled={status === "loading"}>
          <LocateFixed size={18} />
          {status === "loading" ? "Finding you..." : "Use My Location"}
        </button>
      </div>

      {loading && <div className="skeleton-detail" />}
      {!loading && errorMessage && <EmptyState title="Map could not be loaded" message={errorMessage} />}
      {!loading && !errorMessage && properties.length === 0 && (
        <EmptyState
          title="No available rooms have been added to this area yet."
          message="Once the admin publishes active rooms with coordinates, they will appear here."
        />
      )}
      {!loading && !errorMessage && properties.length > 0 && (
        <PropertyMap
          properties={properties}
          settings={settings}
          userLocation={coords}
          onViewDetails={setSelectedProperty}
          height="calc(100vh - 230px)"
        />
      )}

      {selectedProperty && settings && (
        <PropertyDetailsModal
          property={selectedProperty}
          settings={settings}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </section>
  );
};
