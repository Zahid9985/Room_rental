import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { PropertyCard } from "../components/PropertyCard";
import { useSavedProperties } from "../hooks/useSavedProperties";

export const SavedPage = () => {
  const { saved, isSaved, toggleSaved } = useSavedProperties();

  return (
    <section className="content-band page-band">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Saved</p>
          <h1>Your shortlisted rooms</h1>
        </div>
        <Link to="/explore" className="secondary-button">Explore more</Link>
      </div>
      {saved.length === 0 ? (
        <EmptyState
          title="No saved rooms yet"
          message="Save a property while exploring and it will stay on this device."
          action={<Link className="primary-button" to="/explore"><Bookmark size={18} /> Browse rooms</Link>}
        />
      ) : (
        <div className="property-grid">
          {saved.map((property) => (
            <PropertyCard key={property.id} property={property} saved={isSaved(property.id)} onToggleSaved={toggleSaved} />
          ))}
        </div>
      )}
    </section>
  );
};
