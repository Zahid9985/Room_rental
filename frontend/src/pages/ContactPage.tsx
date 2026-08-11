import { useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { EnquiryModal } from "../components/EnquiryModal";

export const ContactPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="content-band page-band contact-page">
      <div className="contact-hero">
        <p className="eyebrow">Contact</p>
        <h1>Tell us what kind of room you need.</h1>
        <p>
          Share your preferred locality, budget, and move-in timeline. The middleman can match you
          with available properties and schedule visits.
        </p>
        <button className="primary-button" onClick={() => setOpen(true)}>
          <MessageCircle size={18} /> Request callback
        </button>
      </div>
      <div className="contact-grid">
        <div className="section-card">
          <Phone size={24} />
          <h2>Call</h2>
          <a href="tel:+919876543210">+91 98765 43210</a>
        </div>
        <div className="section-card">
          <MessageCircle size={24} />
          <h2>WhatsApp</h2>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">Message now</a>
        </div>
        <div className="section-card">
          <Mail size={24} />
          <h2>Email</h2>
          <a href="mailto:hello@ssrooms.local">hello@ssrooms.local</a>
        </div>
      </div>
      {open && <EnquiryModal onClose={() => setOpen(false)} />}
    </section>
  );
};
