import { useEffect, useState } from "react";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";
import { getApiMessage } from "../../api/client";
import type { Owner } from "../../api/types";
import { useToast } from "../../context/ToastContext";

const emptyOwner = { name: "", phone: "", alternatePhone: "", email: "", address: "", notes: "" };

export const AdminOwnersPage = () => {
  const { addToast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [form, setForm] = useState<Partial<Owner>>(emptyOwner);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    adminApi.owners().then(setOwners).catch((error) => addToast(getApiMessage(error), "error"));
  };

  useEffect(load, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) await adminApi.updateOwner(editingId, form);
      else await adminApi.createOwner(form);
      addToast(editingId ? "Owner updated." : "Owner added.", "success");
      setForm(emptyOwner);
      setEditingId(null);
      load();
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  const remove = async (owner: Owner) => {
    if (!confirm(`Delete owner ${owner.name}?`)) return;
    try {
      await adminApi.deleteOwner(owner.id);
      addToast("Owner deleted.", "success");
      load();
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div><p className="eyebrow">Owners</p><h1>Owner database</h1></div>
      </div>
      <div className="admin-two-col">
        <form className="admin-panel stacked-form" onSubmit={submit}>
          <h2>{editingId ? "Edit owner" : "Add owner"}</h2>
          <label className="field"><span>Name</span><input required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="field"><span>Phone</span><input required value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="field"><span>Alternate phone</span><input value={form.alternatePhone || ""} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} /></label>
          <label className="field"><span>Email</span><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="field"><span>Address</span><textarea rows={3} value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label className="field"><span>Notes</span><textarea rows={3} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          <button className="primary-button"><Save size={18} /> Save owner</button>
        </form>
        <div className="admin-panel">
          <div className="panel-heading"><div><p className="eyebrow">{owners.length} records</p><h2>Owners</h2></div><Plus size={20} /></div>
          <div className="owner-list">
            {owners.map((owner) => (
              <div className="owner-row" key={owner.id}>
                <div><strong>{owner.name}</strong><span>{owner.phone}</span><small>{owner._count?.properties || 0} properties</small></div>
                <div className="row-actions">
                  <button className="icon-button" onClick={() => { setEditingId(owner.id); setForm(owner); }} aria-label="Edit owner"><Edit size={17} /></button>
                  <button className="icon-button danger" onClick={() => remove(owner)} aria-label="Delete owner"><Trash2 size={17} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
