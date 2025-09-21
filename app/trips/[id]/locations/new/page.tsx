// app/trips/[id]/locations/new/page.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import LocationForm from "../_components/LocationForm";

export default async function NewLocationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/trips"); // they'll be asked to sign in there
  }
  const tripId = Number(params.id);
  if (!Number.isFinite(tripId)) notFound();

  const [trip] = await db
    .select({ id: trips.id, title: trips.title })
    .from(trips)
    .where(
      and(eq(trips.id, tripId), eq(trips.userId, session.user.id as string))
    )
    .limit(1);

  if (!trip) notFound();

  return (
    <section className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add location</h1>
        <p className="opacity-70">
          Trip: <span className="font-medium">{trip.title}</span>
        </p>
      </div>

      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <LocationForm tripId={trip.id} />
        </div>
      </div>
    </section>
  );
}
