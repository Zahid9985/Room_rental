import { Bell, Bookmark, Home, Info, Map, Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "../components/Logo";

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Search },
  { to: "/map", label: "Map", icon: Map },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/about", label: "About", icon: Info }
];

export const PublicLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Logo />
        <nav className={`top-nav ${open ? "open" : ""}`} aria-label="Primary">
          {publicLinks.slice(0, 4).map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="nav-cta" onClick={() => setOpen(false)}>
            Find a Room
          </NavLink>
        </nav>
        <div className="header-actions">
          <NavLink to="/admin/login" className="icon-button" aria-label="Admin login" title="Admin">
            <UserRound size={18} />
          </NavLink>
          <button className="icon-button" aria-label="Notifications" title="Notifications">
            <Bell size={18} />
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <Logo compact />
        <span>Verified rental rooms around Berhampore.</span>
        <div>
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/terms">Terms</NavLink>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {publicLinks.slice(0, 4).map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to}>
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
