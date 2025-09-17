// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Plan. Explore. Remember.
        </h1>
        <p className="text-base-content/80 max-w-2xl mx-auto">
          A minimal, modern travel planner. Create trips, add locations, and
          visualize your journey on a map.
        </p>
        <Link href="/trips" className="btn btn-primary rounded-md">
          Check it out
        </Link>
      </section>

      {/* Guide */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">1. Sign in</h3>
            <p className="text-sm opacity-80">
              Use your GitHub account to sign in (Google optional later).
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">2. Create a trip</h3>
            <p className="text-sm opacity-80">
              Add a title, dates, optional description and image (with preview).
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">3. Add locations</h3>
            <p className="text-sm opacity-80">
              Search an address, drop pins, and see your route on Google Maps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
