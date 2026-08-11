import { useEffect, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, LocateFixed, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import type { Property } from "../api/types";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyGridSkeleton } from "../components/LoadingSkeleton";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSavedProperties } from "../hooks/useSavedProperties";
import { useToast } from "../context/ToastContext";

const steps = [
  "Share your location",
  "Discover nearby rooms",
  "Compare properties",
  "Contact and visit"
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { coords, status, error, requestLocation } = useGeolocation();
  const { isSaved, toggleSaved } = useSavedProperties();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .featuredProperties()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status === "granted" && coords) {
      navigate(`/explore?lat=${coords.lat}&lng=${coords.lng}&radius=5`);
    }
    if (status === "denied" && error) {
      addToast(error, "info");
      navigate("/explore");
    }
  }, [status, coords, error, navigate, addToast]);

  return (
    <>
      <section className="hero-section">
        <img className="hero-bg" src="/room_rent.jpeg" alt="Premium room rental interface preview" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Verified rentals in Berhampore</p>
          <h1>Your next room is closer than you think.</h1>
          <p>
            Discover rooms, PGs, and apartments around your current location with clear pricing,
            verified listings, map search, and fast enquiries through SS Room Rentals.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={requestLocation} disabled={status === "loading"}>
              <LocateFixed size={18} />
              {status === "loading" ? "Finding nearby rooms..." : "Find Rooms Near Me"}
            </button>
            <Link to="/explore" className="secondary-button">
              Explore Properties <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Recently added</p>
          <h2>Featured rooms</h2>
          <Link to="/explore">See all</Link>
        </div>
        {loading ? (
          <PropertyGridSkeleton count={3} />
        ) : (
          <div className="property-grid">
            {featured.slice(0, 6).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={isSaved(property.id)}
                onToggleSaved={toggleSaved}
              />
            ))}
          </div>
        )}
      </section>

      <section className="content-band compact-band">
        <div className="category-grid">
          {["Single Room", "PG", "1 BHK", "Shared Room"].map((category) => (
            <Link to={`/explore?search=${encodeURIComponent(category)}`} className="category-tile" key={category}>
              <Building2 size={22} />
              <span>{category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-band split-band">
        <div>
          <p className="eyebrow">Why SS</p>
          <h2>Simple room discovery, handled by a real middleman.</h2>
          <div className="benefit-list">
            <span><ShieldCheck size={18} /> Verified broker-led listings</span>
            <span><MapPin size={18} /> Radius search around your location</span>
            <span><MessageCircle size={18} /> Enquiries tracked for follow-up</span>
          </div>
        </div>
        <div className="steps-panel">
          {steps.map((step, index) => (
            <div className="step-row" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              <CheckCircle2 size={18} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
