import { useEffect, useState } from "react";
import { CalendarDays, Save } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { getApiMessage } from "../../api/client";
import type { Property, Visit } from "../../api/types";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

export const AdminVisitsPage = () => {
  const { addToast } = useToast();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({ propertyId: "", visitorName: "", phone: "", scheduledAt: "", notes: "" });

  const load = () => {
    Promise.all([adminApi.visits(), adminApi.properties({ limit: 100 })])
      .then(([visitRows, propertyRows]) => {
        setVisits(visitRows);
        setProperties(propertyRows.items);
        setForm((current) => ({ ...current, propertyId: current.propertyId || propertyRows.items[0]?.id || "" }));
      })
      .catch((error) => addToast(getApiMessage(error), "error"));
  };

  useEffect(load, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await adminApi.createVisit(form);
      addToast("Visit scheduled.", "success");
      setForm({ propertyId: properties[0]?.id || "", visitorName: "", phone: "", scheduledAt: "", notes: "" });
      load();
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><div><p className="eyebrow">Visits</p><h1>Scheduled visits</h1></div></div>
      <div className="admin-two-col">
        <form className="admin-panel stacked-form" onSubmit={submit}>
          <h2>Schedule visit</h2>
          <label className="field"><span>Property</span><select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })}>{properties.map((property) => <option key={property.id} value={property.id}>{property.propertyCode} • {property.title}</option>)}</select></label>
          <label className="field"><span>Visitor name</span><input required value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} /></label>
          <label className="field"><span>Phone</span><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="field"><span>Date and time</span><input required type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></label>
          <label className="field"><span>Notes</span><textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          <button className="primary-button"><Save size={18} /> Save visit</button>
        </form>
        <div className="admin-panel">
          <div className="panel-heading"><div><p className="eyebrow">{visits.length} visits</p><h2>Upcoming</h2></div><CalendarDays size={20} /></div>
          <div className="owner-list">
            {visits.map((visit) => (
              <div className="owner-row" key={visit.id}>
                <div>
                  <strong>{visit.visitorName}</strong>
                  <span>{visit.property.propertyCode} • {visit.property.title}</span>
                  <small>{formatDate(visit.scheduledAt)} • {visit.phone}</small>
                </div>
                <span className={`status-pill status-${visit.status.toLowerCase()}`}>{visit.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
