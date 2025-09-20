// app/trips/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { listMyTrips } from "./actions";
import TripForm from "./_components/TripForm";
import TripLists from "./_components/TripLists";

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Please sign in to view your trips
        </h1>
        <Link href="/api/auth/signin" className="btn btn-primary rounded-md">
          Sign in with GitHub
        </Link>
      </div>
    );
  }

  const data = await listMyTrips();

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: create trip */}
        <div className="lg:col-span-1">
          <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Add a trip</h2>
              <p className="text-sm opacity-70">
                Title and dates are required. Image and description are
                optional.
              </p>
              <TripForm />
            </div>
          </div>
        </div>

        {/* Right: lists + stats */}
        <div className="lg:col-span-2 bg-base-200 p-5 rounded-md">
          <TripLists
            name={session.user?.name ?? "traveler"}
            counts={data.counts}
            upcoming={data.upcoming as any}
            past={data.past as any}
          />
        </div>
      </div>
    </section>
  );
}
