import { Home, Map, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "../components/Logo";

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/contact", label: "Contact", icon: MessageCircle }
];

export const PublicLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Logo />
        <nav className={`top-nav ${open ? "open" : ""}`} aria-label="Primary">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="icon-button mobile-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer simple-footer">
        <Logo compact />
        <span>Middleman-managed room discovery.</span>
      </footer>

      <nav className="bottom-nav three-item-nav" aria-label="Mobile navigation">
        {publicLinks.map((link) => {
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
