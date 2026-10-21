import { Link } from "react-router-dom";

export default function Logo({ to = "/" }) {
  return (
    <Link className="logo" to={to} aria-label="CarePortal home">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
        </svg>
      </span>
      <span className="logo-word">
        Care<em>Portal</em>
      </span>
    </Link>
  );
}
