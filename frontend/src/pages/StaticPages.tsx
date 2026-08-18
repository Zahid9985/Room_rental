import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <section className="content-band page-band empty-state">
    <h1>Page not found</h1>
    <p>The page you opened is not available.</p>
    <Link className="primary-button" to="/">Browse rooms</Link>
  </section>
);
