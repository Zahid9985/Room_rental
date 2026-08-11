import { useEffect, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import { getApiMessage, resolveMediaUrl } from "../../api/client";
import type { Paginated, Property } from "../../api/types";
import { propertyStatusLabels } from "../../constants/options";
import { useToast } from "../../context/ToastContext";
import { formatCurrency } from "../../utils/format";

export const AdminPropertiesPage = () => {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Paginated<Property> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .properties({ search: search || undefined, limit: 40 })
      .then(setResult)
      .catch((error) => addToast(getApiMessage(error), "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const archiveProperty = async (property: Property) => {
    if (!confirm(`Archive ${property.propertyCode}?`)) return;
    try {
      await adminApi.archiveProperty(property.id);
      addToast("Property archived.", "success");
      load();
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Properties</p>
          <h1>Rental inventory</h1>
        </div>
        <Link to="/admin/properties/new" className="primary-button">
          <Plus size={18} /> Add property
        </Link>
      </div>

      <div className="admin-toolbar">
        <label className="field search-field">
          <span>Search properties</span>
          <div className="input-with-icon">
            <Search size={17} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} />
          </div>
        </label>
        <button className="secondary-button" onClick={load}>Search</button>
      </div>

      <div className="admin-table">
        {loading && <div className="table-empty">Loading properties...</div>}
        {result?.items.map((property) => (
          <div className="admin-property-row" key={property.id}>
            <img src={resolveMediaUrl(property.coverImage)} alt={property.title} />
            <div>
              <span>{property.propertyCode}</span>
              <strong>{property.title}</strong>
              <small>{property.locality}, {property.city}</small>
            </div>
            <div>{formatCurrency(property.monthlyRent)}</div>
            <div className={`status-pill status-${property.status.toLowerCase()}`}>{propertyStatusLabels[property.status]}</div>
            <div className="row-actions">
              <Link className="icon-button" to={`/admin/properties/${property.id}/edit`} aria-label="Edit property" title="Edit">
                <Edit size={17} />
              </Link>
              <button className="icon-button danger" onClick={() => archiveProperty(property)} aria-label="Archive property" title="Archive">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
