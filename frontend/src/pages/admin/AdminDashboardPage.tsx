import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Home, MessageSquareText, Moon, TrendingUp } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import type { DashboardStats } from "../../api/types";
import { getApiMessage } from "../../api/client";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

const statIcons = [Building2, CheckCircle2, Home, Moon, MessageSquareText, TrendingUp];

export const AdminDashboardPage = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setStats)
      .catch((error) => addToast(getApiMessage(error), "error"));
  }, [addToast]);

  const cards = stats
    ? [
        ["Total Properties", stats.totalProperties],
        ["Available Rooms", stats.availableProperties],
        ["Rented Rooms", stats.rentedProperties],
        ["Inactive Rooms", stats.inactiveProperties],
        ["WhatsApp Clicks / Enquiries", stats.newEnquiries],
        ["Today's Contacts", stats.todaysEnquiries]
      ]
    : [];

  return (
    <section className="admin-page">
      <div className="stat-grid">
        {cards.map(([label, value], index) => {
          const Icon = statIcons[index];
          return (
            <div className="stat-card" key={label}>
              <Icon size={22} />
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          );
        })}
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>Recent properties</h2>
            </div>
          </div>
          <div className="compact-table">
            {stats?.recentProperties.map((property) => (
              <div className="table-row" key={property.id}>
                <span>{property.propertyCode}</span>
                <strong>{property.title}</strong>
                <span>{property.locality}</span>
                <span>{formatCurrency(property.monthlyRent)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CRM</p>
              <h2>Recent enquiries</h2>
            </div>
          </div>
          <div className="compact-table">
            {stats?.recentEnquiries.map((enquiry) => (
              <div className="table-row" key={enquiry.id}>
                <strong>{enquiry.customerName}</strong>
                <span>{enquiry.phone}</span>
                <span>{enquiry.property?.propertyCode || "General"}</span>
                <span className={`status-pill status-${enquiry.status.toLowerCase()}`}>{enquiry.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
