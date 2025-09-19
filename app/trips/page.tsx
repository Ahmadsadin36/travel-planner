// app/trips/page.tsx
import Link from "next/link";
import { auth } from "@/auth"; // v4 helper from your root auth.ts

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Please sign in to view your trips
        </h1>

        {/* Use Link for internal navigation; no prefetch for API route */}
        <Link
          prefetch={false}
          href={{ pathname: "/api/auth/signin", query: { provider: "github" } }}
          className="btn btn-primary rounded-md"
        >
          Sign in with GitHub
        </Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 space-y-2">
      <h1 className="text-2xl font-bold">
        Welcome, {session.user?.name ?? "traveler"}!
      </h1>
      <p className="opacity-70">
        Your trips will appear here. (Next: dashboard)
      </p>
    </section>
  );
}
