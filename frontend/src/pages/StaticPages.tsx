import { Link } from "react-router-dom";

export const AboutPage = () => (
  <section className="content-band page-band prose-page">
    <p className="eyebrow">About</p>
    <h1>Finding a room in a new city should be simple.</h1>
    <p>
      SS Room Rentals is a middleman-led rental discovery platform for Berhampore. The admin
      verifies property details, publishes available rooms, records enquiries, and coordinates
      visits between customers and owners.
    </p>
    <div className="split-band inline-split">
      <div className="section-card">
        <h2>For customers</h2>
        <p>Search nearby rooms, compare rent and amenities, view map locations, and submit a quick enquiry.</p>
      </div>
      <div className="section-card">
        <h2>For the business</h2>
        <p>Manage properties, owners, leads, visits, and contact settings from one protected admin panel.</p>
      </div>
    </div>
  </section>
);

export const PrivacyPage = () => (
  <section className="content-band page-band prose-page">
    <p className="eyebrow">Privacy</p>
    <h1>Privacy placeholder</h1>
    <p>
      This MVP collects location coordinates only when the browser user grants permission. Enquiry
      details are stored so the rental team can contact the customer about requested properties.
    </p>
  </section>
);

export const TermsPage = () => (
  <section className="content-band page-band prose-page">
    <p className="eyebrow">Terms</p>
    <h1>Terms placeholder</h1>
    <p>
      Listings are managed by the platform admin. Customers should verify final rent, rules, deposit,
      and availability before payment or move-in.
    </p>
  </section>
);

export const NotFoundPage = () => (
  <section className="content-band page-band empty-state">
    <h1>Page not found</h1>
    <p>The page you opened is not available.</p>
    <Link className="primary-button" to="/explore">Explore rooms</Link>
  </section>
);
