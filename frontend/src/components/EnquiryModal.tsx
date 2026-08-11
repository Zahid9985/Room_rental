import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import type { Property } from "../api/types";
import { publicApi } from "../api/publicApi";
import { getApiMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

interface EnquiryModalProps {
  property?: Property;
  onClose: () => void;
}

interface EnquiryForm {
  customerName: string;
  phone: string;
  email?: string;
  message?: string;
}

export const EnquiryModal = ({ property, onClose }: EnquiryModalProps) => {
  const { addToast } = useToast();
  const [contact, setContact] = useState<{ phone: string; whatsappUrl: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EnquiryForm>({
    defaultValues: {
      message: property
        ? `Hi, I'm interested in ${property.title} (${property.propertyCode}).`
        : "Hi, I am looking for a room in Berhampore."
    }
  });

  const submit = async (values: EnquiryForm) => {
    try {
      const result = await publicApi.createEnquiry({
        ...values,
        propertyId: property?.id
      });
      setContact(result.contact);
      addToast("Enquiry recorded. The team can follow up now.", "success");
    } catch (error) {
      addToast(getApiMessage(error), "error");
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="enquiry-title">{property ? "Enquire about this room" : "Request a callback"}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close enquiry form">
            <X size={18} />
          </button>
        </div>

        {property && (
          <div className="modal-property-strip">
            <span>{property.propertyCode}</span>
            <strong>{property.title}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="stacked-form">
          <label className="field">
            <span>Name *</span>
            <input {...register("customerName", { required: "Name is required" })} placeholder="Your name" />
            {errors.customerName && <small>{errors.customerName.message}</small>}
          </label>
          <label className="field">
            <span>Phone *</span>
            <input {...register("phone", { required: "Phone is required", minLength: 7 })} placeholder="Mobile number" />
            {errors.phone && <small>Phone number is required</small>}
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" {...register("email")} placeholder="Optional email" />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea rows={4} {...register("message")} />
          </label>
          <button type="submit" className="primary-button full-width" disabled={isSubmitting}>
            <Send size={18} />
            {isSubmitting ? "Sending..." : "Submit enquiry"}
          </button>
        </form>

        {contact && (
          <div className="contact-actions">
            <a className="secondary-button" href={`tel:${contact.phone}`}>
              <Phone size={18} /> Call
            </a>
            <a className="primary-button" href={contact.whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
