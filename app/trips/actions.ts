// app/trips/actions.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper: turn <input type="date"> to YYYY-MM-DD (ISO date only)
const toISODate = (v: FormDataEntryValue | null) =>
  typeof v === "string" && v ? new Date(v).toISOString().slice(0, 10) : null;

// Create a new trip (imageUrl optional)
export async function createTrip(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  const description = (String(formData.get("description") ?? "").trim() || null) as string | null;
  const start = toISODate(formData.get("startDate"));
  const end = toISODate(formData.get("endDate"));
  const imageUrl =
    typeof formData.get("imageUrl") === "string" && formData.get("imageUrl")
      ? String(formData.get("imageUrl"))
      : null;

  if (!title) throw new Error("Title is required");
  if (!start || !end) throw new Error("Start and end dates are required");
  if (new Date(start) > new Date(end)) throw new Error("Start date must be ≤ end date");

  // Insert using camelCase columns as defined in your schema.ts
  await db.insert(trips).values({
    userId: session.user.id as string,
    title,
    description,
    startDate: start as any, // drizzle pg date
    endDate: end as any,
    imageUrl,
  });

  // Refresh the /trips page
  revalidatePath("/trips");
}

// Fetch user's trips and split into upcoming/past
export async function listMyTrips() {
  const session = await auth();
  if (!session?.user?.id) {
    return { upcoming: [], past: [], counts: { total: 0, upcoming: 0, past: 0 } };
  }

  // Use select builder (works without relations helper)
  const rows = await db
    .select()
    .from(trips)
    .where(eq(trips.userId, session.user.id as string))
    .orderBy(desc(trips.startDate));

  // Compare using date-only string (Europe/Rome day boundaries are fine for date-only)
  const now = new Date();
  const todayISO = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    .toISOString()
    .slice(0, 10);

  const past = rows.filter((r) => r.endDate < todayISO);
  const upcoming = rows.filter((r) => r.startDate >= todayISO);

  return {
    upcoming,
    past,
    counts: {
      total: rows.length,
      upcoming: upcoming.length,
      past: past.length,
    },
  };
}
