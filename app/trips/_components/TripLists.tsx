// app/trips/_components/TripLists.tsx
import Link from "next/link";

type Trip = {
  id: number;
  title: string;
  description: string | null;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  imageUrl: string | null;
};

export default function TripLists({
  name,
  counts,
  upcoming,
  past,
}: {
  name: string;
  counts: { total: number; upcoming: number; past: number };
  upcoming: Trip[];
  past: Trip[];
}) {
  return (
    <div className="space-y-10">
      {/* Greeting + counts */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Welcome, {name}!</h2>
        {counts.total > 0 ? (
          <p className="opacity-70">
            You already have <b>{counts.total}</b> trips —{" "}
            <b>{counts.upcoming}</b> upcoming and <b>{counts.past}</b> done.
          </p>
        ) : (
          <p className="opacity-70">
            You don’t have any trips yet. Create your first one with the form on
            the left!
          </p>
        )}
      </div>

      {/* Upcoming */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Upcoming trips</h3>
        {upcoming.length === 0 ? (
          <p className="opacity-60 text-sm">No upcoming trips.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((t) => (
              <Link
                key={t.id}
                href={`/trips/${t.id}`}
                className="card bg-base-100 shadow-xl hover:shadow hover:scale-105 transition rounded-xl overflow-hidden"
              >
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    alt={t.title}
                    className="h-36 w-full object-cover"
                  />
                )}
                <div className="card-body">
                  <h4 className="card-title">{t.title}</h4>
                  {t.description && (
                    <p className="text-sm opacity-80 line-clamp-2">
                      {t.description}
                    </p>
                  )}
                  <p className="text-xs opacity-70">
                    {t.startDate} → {t.endDate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Past trips</h3>
        {past.length === 0 ? (
          <p className="opacity-60 text-sm">No past trips yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((t) => (
              <Link
                key={t.id}
                href={`/trips/${t.id}`}
                className="card bg-base-100 shadow-xl hover:shadow hover:scale-105 transition rounded-xl overflow-hidden"
              >
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    alt={t.title}
                    className="h-36 w-full object-cover"
                  />
                )}
                <div className="card-body">
                  <h4 className="card-title">{t.title}</h4>
                  {t.description && (
                    <p className="text-sm opacity-80 line-clamp-2">
                      {t.description}
                    </p>
                  )}
                  <p className="text-xs opacity-70">
                    {t.startDate} → {t.endDate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
