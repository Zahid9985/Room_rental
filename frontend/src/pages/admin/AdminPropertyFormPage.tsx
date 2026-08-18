import { useEffect, useMemo, useState } from "react";
import { ImagePlus, MapPin, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import { getApiMessage, resolveMediaUrl } from "../../api/client";
import { publicApi } from "../../api/publicApi";
import type { Amenity, Owner, Property, PropertyType } from "../../api/types";
import { preferredTenantOptions, propertyStatuses } from "../../constants/options";
import { useToast } from "../../context/ToastContext";

interface PropertyFormState {
  title: string;
  description: string;
  propertyTypeId: string;
  ownerId: string;
  roomType: string;
  monthlyRent: string;
  securityDeposit: string;
  maintenanceCharge: string;
  otherCharges: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  furnishingStatus: string;
  availableFrom: string;
  preferredTenant: string;
  genderPreference: string;
  bedrooms: string;
  bathrooms: string;
  attachedBathroom: boolean;
  floor: string;
  totalFloors: string;
  status: string;
  featured: boolean;
  verified: boolean;
  rulesText: string;
  landmarksText: string;
  amenityIds: string[];
}

const defaultState: PropertyFormState = {
  title: "",
  description: "",
  propertyTypeId: "",
  ownerId: "",
  roomType: "",
  monthlyRent: "",
  securityDeposit: "",
  maintenanceCharge: "",
  otherCharges: "",
  address: "",
  locality: "Berhampore",
  city: "Berhampore",
  state: "West Bengal",
  postalCode: "742101",
  latitude: "24.0988",
  longitude: "88.2679",
  furnishingStatus: "FURNISHED",
  availableFrom: "",
  preferredTenant: "ANY",
  genderPreference: "",
  bedrooms: "1",
  bathrooms: "1",
  attachedBathroom: false,
  floor: "0",
  totalFloors: "4",
  status: "AVAILABLE",
  featured: false,
  verified: true,
  rulesText: "Valid ID required before visit\nNo smoking inside the room",
  landmarksText: "Berhampore Railway Station\nLocal market",
  amenityIds: []
};

const lines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

export const AdminPropertyFormPage = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState<PropertyFormState>(defaultState);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Property["images"]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([publicApi.propertyTypes(), publicApi.amenities(), adminApi.owners()])
      .then(([typeRows, amenityRows, ownerRows]) => {
        setTypes(typeRows);
        setAmenities(amenityRows);
        setOwners(ownerRows);
        setForm((current) => ({
          ...current,
          propertyTypeId: current.propertyTypeId || typeRows[0]?.id || "",
          ownerId: current.ownerId || ownerRows[0]?.id || "",
          amenityIds: current.amenityIds.length ? current.amenityIds : amenityRows.slice(0, 4).map((amenity) => amenity.id)
        }));
      })
      .catch((error) => addToast(getApiMessage(error), "error"));
  }, [addToast]);

  useEffect(() => {
    if (!id) return;
    adminApi
      .property(id)
      .then((property) => {
        setExistingImages(property.images);
        setForm({
          title: property.title,
          description: property.description,
          propertyTypeId: property.propertyType.id,
          ownerId: property.owner?.id || "",
          roomType: property.roomType || "",
          monthlyRent: String(property.monthlyRent),
          securityDeposit: String(property.securityDeposit || ""),
          maintenanceCharge: String(property.maintenanceCharge || ""),
          otherCharges: property.otherCharges || "",
          address: property.address,
          locality: property.locality,
          city: property.city,
          state: property.state,
          postalCode: property.postalCode || "",
          latitude: String(property.latitude),
          longitude: String(property.longitude),
          furnishingStatus: property.furnishingStatus,
          availableFrom: property.availableFrom ? property.availableFrom.slice(0, 10) : "",
          preferredTenant: property.preferredTenant,
          genderPreference: property.genderPreference || "",
          bedrooms: String(property.bedrooms || 1),
          bathrooms: String(property.bathrooms || 1),
          attachedBathroom: property.attachedBathroom,
          floor: String(property.floor || 0),
          totalFloors: String(property.totalFloors || 1),
          status: property.status,
          featured: property.featured,
          verified: property.verified,
          rulesText: property.rules.join("\n"),
          landmarksText: property.nearbyLandmarks.join("\n"),
          amenityIds: property.amenities.map((amenity) => amenity.id)
        });
      })
      .catch((error) => addToast(getApiMessage(error), "error"));
  }, [id, addToast]);

  const coverPreview = useMemo(() => {
    if (coverFile) return URL.createObjectURL(coverFile);
    return existingImages.find((image) => image.isCover)?.url || existingImages[0]?.url || null;
  }, [coverFile, existingImages]);

  const set = <K extends keyof PropertyFormState>(key: K, value: PropertyFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    set(
      "amenityIds",
      form.amenityIds.includes(amenityId)
        ? form.amenityIds.filter((idValue) => idValue !== amenityId)
        : [...form.amenityIds, amenityId]
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "rulesText") formData.append("rules", JSON.stringify(lines(String(value))));
      else if (key === "landmarksText") formData.append("nearbyLandmarks", JSON.stringify(lines(String(value))));
      else if (key === "amenityIds") formData.append("amenityIds", JSON.stringify(value));
      else formData.append(key, String(value));
    });

    if (coverFile) formData.append("coverImage", coverFile);
    galleryFiles.forEach((file) => formData.append("galleryImages", file));

    try {
      if (editing && id) await adminApi.updateProperty(id, formData);
      else await adminApi.createProperty(formData);
      addToast(editing ? "Property updated." : "Property created.", "success");
      navigate("/admin/properties");
    } catch (error) {
      addToast(getApiMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-page property-form-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">{editing ? "Edit property" : "Add property"}</p>
          <h1>{editing ? form.title || "Edit property" : "Create rental listing"}</h1>
        </div>
        <Link to="/admin/properties" className="secondary-button">Back to list</Link>
      </div>

      <form className="admin-form-grid" onSubmit={submit}>
        <div className="admin-panel form-section">
          <h2>Basic Information</h2>
          <label className="field"><span>Property title</span><input required value={form.title} onChange={(e) => set("title", e.target.value)} /></label>
          <label className="field"><span>Description</span><textarea required rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} /></label>
          <div className="split-fields">
            <label className="field"><span>Property type</span><select value={form.propertyTypeId} onChange={(e) => set("propertyTypeId", e.target.value)}>{types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></label>
            <label className="field"><span>Room type</span><input value={form.roomType} onChange={(e) => set("roomType", e.target.value)} /></label>
          </div>
        </div>

        <div className="admin-panel form-section">
          <h2>Pricing</h2>
          <div className="split-fields">
            <label className="field"><span>Monthly rent</span><input required type="number" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} /></label>
            <label className="field"><span>Security deposit</span><input type="number" value={form.securityDeposit} onChange={(e) => set("securityDeposit", e.target.value)} /></label>
          </div>
          <div className="split-fields">
            <label className="field"><span>Maintenance</span><input type="number" value={form.maintenanceCharge} onChange={(e) => set("maintenanceCharge", e.target.value)} /></label>
            <label className="field"><span>Other charges</span><input value={form.otherCharges} onChange={(e) => set("otherCharges", e.target.value)} /></label>
          </div>
        </div>

        <div className="admin-panel form-section">
          <h2>Location</h2>
          <label className="field"><span>Address</span><input required value={form.address} onChange={(e) => set("address", e.target.value)} /></label>
          <div className="split-fields">
            <label className="field"><span>Locality</span><input required value={form.locality} onChange={(e) => set("locality", e.target.value)} /></label>
            <label className="field"><span>City</span><input required value={form.city} onChange={(e) => set("city", e.target.value)} /></label>
          </div>
          <div className="split-fields">
            <label className="field"><span>Latitude</span><input required type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} /></label>
            <label className="field"><span>Longitude</span><input required type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} /></label>
          </div>
          <p className="muted form-note"><MapPin size={15} /> Map-click coordinate selection can be added without changing the API.</p>
        </div>

        <div className="admin-panel form-section">
          <h2>Property Details</h2>
          <div className="split-fields">
            <label className="field"><span>Furnishing</span><select value={form.furnishingStatus} onChange={(e) => set("furnishingStatus", e.target.value)}><option value="FURNISHED">Furnished</option><option value="SEMI_FURNISHED">Semi furnished</option><option value="UNFURNISHED">Unfurnished</option></select></label>
            <label className="field"><span>Preferred tenant</span><select value={form.preferredTenant} onChange={(e) => set("preferredTenant", e.target.value)}>{preferredTenantOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>
          <div className="split-fields">
            <label className="field"><span>Bedrooms</span><input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></label>
            <label className="field"><span>Bathrooms</span><input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></label>
          </div>
          <div className="split-fields">
            <label className="field"><span>Available from</span><input type="date" value={form.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} /></label>
            <label className="field"><span>Status</span><select value={form.status} onChange={(e) => set("status", e.target.value)}>{propertyStatuses.filter((status) => !["ARCHIVED", "RESERVED"].includes(status)).map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          </div>
          <div className="check-grid">
            <label className="check-row"><input type="checkbox" checked={form.attachedBathroom} onChange={(e) => set("attachedBathroom", e.target.checked)} /> Attached bathroom</label>
            <label className="check-row"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
            <label className="check-row"><input type="checkbox" checked={form.verified} onChange={(e) => set("verified", e.target.checked)} /> Verified</label>
          </div>
        </div>

        <div className="admin-panel form-section">
          <h2>Amenities</h2>
          <div className="chip-grid">
            {amenities.map((amenity) => (
              <button type="button" key={amenity.id} className={`filter-chip ${form.amenityIds.includes(amenity.id) ? "active" : ""}`} onClick={() => toggleAmenity(amenity.id)}>
                {amenity.name}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-panel form-section">
          <h2>Owner Information</h2>
          <label className="field"><span>Owner</span><select value={form.ownerId} onChange={(e) => set("ownerId", e.target.value)}>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name} • {owner.phone}</option>)}</select></label>
          <label className="field"><span>Gender preference</span><input value={form.genderPreference} onChange={(e) => set("genderPreference", e.target.value)} /></label>
        </div>

        <div className="admin-panel form-section">
          <h2>Rules and Landmarks</h2>
          <label className="field"><span>Rules</span><textarea rows={5} value={form.rulesText} onChange={(e) => set("rulesText", e.target.value)} /></label>
          <label className="field"><span>Nearby landmarks</span><textarea rows={5} value={form.landmarksText} onChange={(e) => set("landmarksText", e.target.value)} /></label>
        </div>

        <div className="admin-panel form-section">
          <h2>Images</h2>
          {coverPreview && <img className="image-preview" src={resolveMediaUrl(coverPreview)} alt="Cover preview" />}
          <label className="upload-field">
            <ImagePlus size={20} />
            <span>Cover image</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
          </label>
          <label className="upload-field">
            <ImagePlus size={20} />
            <span>Gallery images</span>
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" disabled={saving || !owners.length || !types.length}>
            <Save size={18} />
            {saving ? "Saving..." : "Save property"}
          </button>
        </div>
      </form>
    </section>
  );
};
