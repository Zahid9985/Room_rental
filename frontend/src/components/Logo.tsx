import { Link } from "react-router-dom";

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/" className={`brand ${compact ? "brand-compact" : ""}`} aria-label="SS Room Rentals home">
    <span className="brand-mark">SS</span>
    {!compact && <span className="brand-text">Room Rentals</span>}
  </Link>
);
