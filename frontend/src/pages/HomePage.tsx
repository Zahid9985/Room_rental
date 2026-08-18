import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getApiMessage } from "../api/client";
import { publicApi } from "../api/publicApi";
import type { Paginated, Property, PropertyType, Settings } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { PropertyGridSkeleton } from "../components/LoadingSkeleton";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyDetailsModal } from "../components/PropertyDetailsModal";
import { useToast } from "../context/ToastContext";

interface HomeFilters {
  search: string;
  propertyType: string;
  minRent: string;
  maxRent: string;
}

const defaultFilters: HomeFilters = {
  search: "",
  propertyType: "",
  minRent: "",
  maxRent: ""
};

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [result, setResult] = useState<Paginated<Property> | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<HomeFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([publicApi.settings(), publicApi.propertyTypes()])
      .then(([settingsData, types]) => {
        setSettings(settingsData);
        setPropertyTypes(types);
      })
      .catch((error) => addToast(getApiMessage(error), "error"));
  }, [addToast]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);
    publicApi
      .listProperties({
        search: filters.search || undefined,
        propertyType: filters.propertyType || undefined,
        minRent: filters.minRent ? Number(filters.minRent) : undefined,
        maxRent: filters.maxRent ? Number(filters.maxRent) : undefined,
        sort: "recent",
        limit: 32
      })
      .then(setResult)
      .catch((error) => setErrorMessage(getApiMessage(error)))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const slug = searchParams.get("property");
    if (!slug || !result?.items.length) return;
    const property = result.items.find((item) => item.slug === slug);
    if (property) setSelectedProperty(property);
  }, [result, searchParams]);

  const pageTitle = settings?.websiteName || settings?.businessName || "SS Room Rentals";
  const tagline = settings?.shortTagline || "Discover available rooms near you.";
  const properties = result?.items ?? [];
  const hasFilters = useMemo(
    () => Boolean(filters.search || filters.propertyType || filters.minRent || filters.maxRent),
    [filters]
  );

  return (
    <section className="home-catalogue-page">
      <div className="catalogue-intro">
        <div>
          <p className="eyebrow">{settings?.operatingCity || settings?.serviceCity || "Room discovery"}</p>
          <h1>Find Your Next Room</h1>
          <p>{tagline}</p>
        </div>
        <div className="catalogue-intro-card">
          <strong>{pageTitle}</strong>
          <span>Middleman-managed verified room listings</span>
        </div>
      </div>

      <div className="catalogue-toolbar">
        <label className="field search-field">
          <span>Search rooms</span>
          <div className="input-with-icon">
            <Search size={17} />
            <input
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
              placeholder="Locality, property name, BRP-0012"
            />
          </div>
        </label>
        <label className="field compact-select">
          <span>Type</span>
          <select value={filters.propertyType} onChange={(event) => setFilters({ ...filters, propertyType: event.target.value })}>
            <option value="">All rooms</option>
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.slug}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field compact-select">
          <span>Min rent</span>
          <input
            type="number"
            min="0"
            value={filters.minRent}
            onChange={(event) => setFilters({ ...filters, minRent: event.target.value })}
            placeholder="₹"
          />
        </label>
        <label className="field compact-select">
          <span>Max rent</span>
          <input
            type="number"
            min="0"
            value={filters.maxRent}
            onChange={(event) => setFilters({ ...filters, maxRent: event.target.value })}
            placeholder="₹"
          />
        </label>
        {hasFilters && (
          <button type="button" className="ghost-button" onClick={() => setFilters(defaultFilters)}>
            <Filter size={17} />
            Clear
          </button>
        )}
      </div>

      <div className="catalogue-count">
        <span>{result?.total ?? 0} available rooms</span>
      </div>

      {loading && <PropertyGridSkeleton count={8} />}
      {!loading && errorMessage && <EmptyState title="Rooms could not be loaded" message={errorMessage} />}
      {!loading && !errorMessage && properties.length === 0 && (
        <EmptyState
          title={hasFilters ? "No rooms found for this search." : "No rooms are currently available."}
          message="Try a different locality, price range, or room type."
        />
      )}
      {!loading && !errorMessage && properties.length > 0 && (
        <div className="property-grid catalogue-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onOpen={setSelectedProperty} />
          ))}
        </div>
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
