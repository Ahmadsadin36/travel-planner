// app/trips/[id]/locations/actions.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { trips, locations } from "@/db/schema";
import { and, eq, max } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Safely parse numeric fields
function toNumber(v: FormDataEntryValue | null) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createLocation(tripIdParam: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const tripId = Number(tripIdParam);
  if (!Number.isFinite(tripId)) {
    throw new Error("Invalid trip id");
  }

  // Owner check
  const [trip] = await db
    .select({ id: trips.id, userId: trips.userId })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, session.user.id as string)))
    .limit(1);

  if (!trip) {
    throw new Error("Trip not found or you do not have access");
  }

  // Read fields
  const title = (formData.get("title") as string)?.trim();
  const address = ((formData.get("address") as string) || "").trim() || null;
  const lat = toNumber(formData.get("lat"));
  const lng = toNumber(formData.get("lng"));

  if (!title) throw new Error("Title is required");
  if (lat === null || lng === null) throw new Error("Latitude and longitude are required");

  // Find next order per trip (MAX(order)+1)
  const [agg] = await db
    .select({ last: max(locations.order) })
    .from(locations)
    .where(eq(locations.tripId, tripId));

  const nextOrder = (agg?.last ?? 0) + 1;

  // Insert
  await db.insert(locations).values({
    tripId,
    title,
    address,
    lat: lat as any,
    lng: lng as any,
    order: nextOrder,
  });

  // Refresh the trip page and go back
  revalidatePath(`/trips/${tripId}`);
  redirect(`/trips/${tripId}`);
}
