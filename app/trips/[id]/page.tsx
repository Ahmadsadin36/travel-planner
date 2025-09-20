// app/trips/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { trips, locations } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import TripMap from "@/components/maps/TripMap";

function DateRange({ start, end }: { start: string; end: string }) {
  return (
    <p className="opacity-70">
      {start} → {end}
    </p>
  );
}

export default async function TripDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) return notFound();

  const tripId = Number(params.id);
  if (Number.isNaN(tripId)) return notFound();

  // Ensure the trip exists and belongs to the current user
  const [trip] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, session.user.id)));

  if (!trip) return notFound();

  // Fetch locations in display order
  const locs = await db
    .select()
    .from(locations)
    .where(eq(locations.tripId, trip.id))
    .orderBy(asc(locations.order));

  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero image */}
      <div className="rounded-2xl overflow-hidden border">
        {trip.imageUrl ? (
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-64 md:h-80 object-cover"
          />
        ) : (
          <div className="w-full h-64 md:h-80 bg-base-200 grid place-items-center">
            <span className="opacity-60">No cover image</span>
          </div>
        )}
      </div>

      {/* Title + dates + add-location */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <DateRange start={trip.startDate} end={trip.endDate} />
        </div>

        <Link
          href={`/trips/${trip.id}/locations/new`}
          className="btn btn-primary rounded-md"
        >
          Add location
        </Link>
      </div>

      {/* Tabs */}
      <TripTabs
        overview={
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              {trip.description ? (
                <p className="opacity-80 whitespace-pre-wrap">
                  {trip.description}
                </p>
              ) : (
                <p className="opacity-60 text-sm">No description provided.</p>
              )}
            </div>

            {/* Ordered destinations */}
            <div>
              <h3 className="font-medium mb-2">Destinations (ordered)</h3>
              {locs.length === 0 ? (
                <p className="opacity-60 text-sm">
                  No locations yet. Click “Add location”.
                </p>
              ) : (
                <ol className="list-decimal pl-5 space-y-1">
                  {locs.map((l) => (
                    <li key={l.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{l.title}</span>
                        <span className="text-xs opacity-70">
                          {l.address || "No address"} • {l.lat},{l.lng}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        }
        map={
          <TripMap
            locations={locs.map((l) => ({
              title: l.title,
              lat: l.lat,
              lng: l.lng,
            }))}
          />
        }
      />
    </section>
  );
}

/* ---------- Local tabs wrapper (keeps this page server-side) ---------- */
import TripTabs from "../_components/Tabs";
