import { SlidersHorizontal } from "lucide-react";
import type { Amenity, PropertyType } from "../api/types";
import { radiusOptions } from "../constants/options";

export interface ExploreFilters {
  search: string;
  radius: number;
  minRent: string;
  maxRent: string;
  propertyType: string;
  furnishingStatus: string;
  availableNow: boolean;
  amenities: string[];
  sort: string;
}

interface FilterPanelProps {
  filters: ExploreFilters;
  propertyTypes: PropertyType[];
  amenities: Amenity[];
  onChange: (filters: ExploreFilters) => void;
  onReset: () => void;
}

export const FilterPanel = ({ filters, propertyTypes, amenities, onChange, onReset }: FilterPanelProps) => {
  const set = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (slug: string) => {
    const next = filters.amenities.includes(slug)
      ? filters.amenities.filter((item) => item !== slug)
      : [...filters.amenities, slug];
    set("amenities", next);
  };

  return (
    <aside className="filter-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Filters</p>
          <h2>Refine rooms</h2>
        </div>
        <SlidersHorizontal size={20} />
      </div>

      <label className="field">
        <span>Search</span>
        <input
          value={filters.search}
          onChange={(event) => set("search", event.target.value)}
          placeholder="Locality, landmark, property ID"
        />
      </label>

      <label className="field">
        <span>Radius</span>
        <select value={filters.radius} onChange={(event) => set("radius", Number(event.target.value))}>
          {radiusOptions.map((radius) => (
            <option key={radius} value={radius}>
              Within {radius} km
            </option>
          ))}
        </select>
      </label>

      <div className="split-fields">
        <label className="field">
          <span>Min rent</span>
          <input
            type="number"
            min="0"
            value={filters.minRent}
            onChange={(event) => set("minRent", event.target.value)}
            placeholder="₹"
          />
        </label>
        <label className="field">
          <span>Max rent</span>
          <input
            type="number"
            min="0"
            value={filters.maxRent}
            onChange={(event) => set("maxRent", event.target.value)}
            placeholder="₹"
          />
        </label>
      </div>

      <label className="field">
        <span>Type</span>
        <select value={filters.propertyType} onChange={(event) => set("propertyType", event.target.value)}>
          <option value="">Any type</option>
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.slug}>
              {type.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Furnishing</span>
        <select value={filters.furnishingStatus} onChange={(event) => set("furnishingStatus", event.target.value)}>
          <option value="">Any furnishing</option>
          <option value="FURNISHED">Furnished</option>
          <option value="SEMI_FURNISHED">Semi furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
        </select>
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          checked={filters.availableNow}
          onChange={(event) => set("availableNow", event.target.checked)}
        />
        <span>Available now</span>
      </label>

      <label className="field">
        <span>Sort</span>
        <select value={filters.sort} onChange={(event) => set("sort", event.target.value)}>
          <option value="nearest">Nearest</option>
          <option value="recent">Recently added</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
        </select>
      </label>

      <div className="amenity-filter">
        <span>Amenities</span>
        <div className="chip-grid">
          {amenities.map((amenity) => (
            <button
              type="button"
              className={`filter-chip ${filters.amenities.includes(amenity.slug) ? "active" : ""}`}
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.slug)}
            >
              {amenity.name}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="ghost-button full-width" onClick={onReset}>
        Reset filters
      </button>
    </aside>
  );
};
