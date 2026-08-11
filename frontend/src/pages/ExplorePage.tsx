import { useEffect, useMemo, useState } from "react";
import { Grid2X2, LocateFixed, Map, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getApiMessage } from "../api/client";
import { publicApi } from "../api/publicApi";
import type { Amenity, Paginated, Property, PropertyType } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { type ExploreFilters, FilterPanel } from "../components/FilterPanel";
import { PropertyGridSkeleton } from "../components/LoadingSkeleton";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyMap } from "../components/PropertyMap";
import { useToast } from "../context/ToastContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSavedProperties } from "../hooks/useSavedProperties";

const defaultFilters: ExploreFilters = {
  search: "",
  radius: 5,
  minRent: "",
  maxRent: "",
  propertyType: "",
  furnishingStatus: "",
  availableNow: false,
  amenities: [],
  sort: "nearest"
};

export const ExplorePage = ({ initialView = "grid" }: { initialView?: "grid" | "map" }) => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const { coords, status, error, requestLocation } = useGeolocation();
  const { isSaved, toggleSaved } = useSavedProperties();
  const [view, setView] = useState<"grid" | "map">(initialView);
  const [filters, setFilters] = useState<ExploreFilters>({
    ...defaultFilters,
    search: searchParams.get("search") || "",
    radius: Number(searchParams.get("radius") || 5)
  });
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [result, setResult] = useState<Paginated<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const urlCoords = useMemo(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (!lat || !lng) return null;
    return { lat: Number(lat), lng: Number(lng) };
  }, [searchParams]);

  const activeCoords = coords || urlCoords;

  useEffect(() => {
    Promise.all([publicApi.propertyTypes(), publicApi.amenities()])
      .then(([types, amenityList]) => {
        setPropertyTypes(types);
        setAmenities(amenityList);
      })
      .catch(() => addToast("Some filter data could not be loaded.", "error"));
  }, [addToast]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMessage(null);

    const params = {
      search: filters.search || undefined,
      radius: filters.radius,
      minRent: filters.minRent ? Number(filters.minRent) : undefined,
      maxRent: filters.maxRent ? Number(filters.maxRent) : undefined,
      propertyType: filters.propertyType || undefined,
      furnishingStatus: filters.furnishingStatus || undefined,
      availableNow: filters.availableNow || undefined,
      amenities: filters.amenities.join(",") || undefined,
      sort: activeCoords ? filters.sort : filters.sort === "nearest" ? "recent" : filters.sort,
      lat: activeCoords?.lat,
      lng: activeCoords?.lng,
      limit: 24
    };

    const request = activeCoords
      ? publicApi.nearbyProperties({ ...params, lat: activeCoords.lat, lng: activeCoords.lng, radius: filters.radius })
      : publicApi.listProperties(params);

    request
      .then(setResult)
      .catch((apiError) => setErrorMessage(getApiMessage(apiError)))
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters, activeCoords]);

  useEffect(() => {
    if (status === "denied" && error) addToast(error, "info");
  }, [status, error, addToast]);

  const properties = result?.items ?? [];

  return (
    <section className="explore-page">
      <div className="explore-hero">
        <div>
          <p className="eyebrow">Explore</p>
          <h1>Find a room near you.</h1>
          <p>
            {activeCoords
              ? `Showing properties within ${filters.radius} km of your location.`
              : "Allow location for nearest results, or search by locality, landmark, or property ID."}
          </p>
        </div>
        <button className="primary-button" onClick={requestLocation} disabled={status === "loading"}>
          <LocateFixed size={18} />
          {status === "loading" ? "Checking location..." : "Use my location"}
        </button>
      </div>

      <div className="explore-layout">
        <FilterPanel
          filters={filters}
          propertyTypes={propertyTypes}
          amenities={amenities}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="results-panel">
          <div className="results-toolbar">
            <div>
              <p className="eyebrow">{result?.total ?? 0} matches</p>
              <h2>{view === "grid" ? "Available rooms" : "Map search"}</h2>
            </div>
            <div className="segmented-control" aria-label="View mode">
              <button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
                <Grid2X2 size={17} /> Grid
              </button>
              <button type="button" className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
                <Map size={17} /> Map
              </button>
            </div>
          </div>

          {loading && <PropertyGridSkeleton />}
          {!loading && errorMessage && (
            <EmptyState title="Search failed" message={errorMessage} action={<button className="secondary-button" onClick={() => setFilters({ ...filters })}>Retry</button>} />
          )}
          {!loading && !errorMessage && properties.length === 0 && (
            <EmptyState
              title={`No rooms found within ${filters.radius} km.`}
              message="Try a wider radius, remove one filter, or search another locality."
              action={
                <button className="primary-button" onClick={() => setFilters({ ...filters, radius: 10 })}>
                  <Search size={18} /> Increase radius to 10 km
                </button>
              }
            />
          )}
          {!loading && !errorMessage && properties.length > 0 && view === "grid" && (
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={isSaved(property.id)}
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          )}
          {!loading && !errorMessage && properties.length > 0 && view === "map" && (
            <div className="map-results">
              <PropertyMap properties={properties} userLocation={activeCoords} />
              <div className="map-result-list">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    saved={isSaved(property.id)}
                    onToggleSaved={toggleSaved}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
