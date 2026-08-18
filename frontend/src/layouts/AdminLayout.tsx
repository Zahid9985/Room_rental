import { Building2, Home, LayoutDashboard, LogOut, MessageSquareText, Plus, Settings } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/properties/new", label: "Add Property", icon: Plus },
  { to: "/admin/enquiries", label: "Contacts / Enquiries", icon: MessageSquareText },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];

export const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo />
        <nav aria-label="Admin">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to}>
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>{admin?.name || "Room Rental Admin"}</h1>
          </div>
          <NavLink to="/" className="secondary-button">
            <Home size={18} />
            Public site
          </NavLink>
        </header>
        <Outlet />
      </div>
    </div>
  );
};
