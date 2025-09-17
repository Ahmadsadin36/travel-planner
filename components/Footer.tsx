// components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className="border-t bg-base-100 text-base-content">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <p className="text-sm">
          Built by <span className="font-medium">Ahmad Sadin</span>
        </p>

        {/* Back to top (icon-only) */}
        <a
          href="#top"
          aria-label="Back to top"
          className="btn btn-ghost btn-circle"
          title="Back to top"
        >
          {/* Minimal chevron icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
