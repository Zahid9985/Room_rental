import { useEffect, useState } from "react";
import { CalendarPlus, Search } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { getApiMessage } from "../../api/client";
import type { Enquiry, Paginated } from "../../api/types";
import { enquiryStatusLabels, enquiryStatuses } from "../../constants/options";
import { useToast } from "../../context/ToastContext";

export const AdminEnquiriesPage = () => {
  const { addToast } = useToast();
  const [result, setResult] = useState<Paginated<Enquiry> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = () => {
    adminApi
      .enquiries({ search: search || undefined, status: status || undefined, limit: 50 })
      .then((data) => {
        setResult(data);
        setNotes(Object.fromEntries(data.items.map((item) => [item.id, item.internalNotes || ""])));
      })
      .catch((error) => addToast(getApiMessage(error), "error"));
  };

  useEffect(load, []);

  const updateStatus = async (enquiry: Enquiry, nextStatus: string) => {
    try {
      await adminApi.updateEnquiryStatus(enquiry.id, { status: nextStatus, internalNotes: notes[enquiry.id] });
      addToast("Lead updated.", "success");
      load();
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Leads</p>
          <h1>Enquiry management</h1>
        </div>
      </div>
      <div className="admin-toolbar">
        <label className="field search-field"><span>Search leads</span><div className="input-with-icon"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} /></div></label>
        <label className="field small-field"><span>Status</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option>{enquiryStatuses.map((item) => <option key={item} value={item}>{enquiryStatusLabels[item]}</option>)}</select></label>
        <button className="secondary-button" onClick={load}>Apply</button>
      </div>
      <div className="admin-table lead-table">
        {result?.items.map((enquiry) => (
          <div className="lead-row" key={enquiry.id}>
            <div>
              <strong>{enquiry.customerName}</strong>
              <span>{enquiry.phone} {enquiry.email ? `• ${enquiry.email}` : ""}</span>
              <small>{enquiry.property ? `${enquiry.property.propertyCode} • ${enquiry.property.title}` : "General enquiry"}</small>
            </div>
            <p>{enquiry.message || "No message"}</p>
            <label className="field"><span>Status</span><select value={enquiry.status} onChange={(e) => updateStatus(enquiry, e.target.value)}>{enquiryStatuses.map((item) => <option key={item} value={item}>{enquiryStatusLabels[item]}</option>)}</select></label>
            <label className="field"><span>Internal notes</span><textarea rows={2} value={notes[enquiry.id] || ""} onChange={(e) => setNotes({ ...notes, [enquiry.id]: e.target.value })} /></label>
            <button className="secondary-button" onClick={() => updateStatus(enquiry, "VISIT_SCHEDULED")}>
              <CalendarPlus size={17} /> Mark visit
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
