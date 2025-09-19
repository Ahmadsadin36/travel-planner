// components/Header.tsx
// Server Component (no "use client"). Reads session on the server
// and delegates sign in/out to a small client button.

import Link from "next/link";
import { auth } from "@/auth"; // v4 helper exported from your root auth.ts
import AuthButton from "./AuthButton"; // client component that calls signIn/signOut
import ThemeToggle from "./ThemeToggle";

export default async function Header() {
  const session = await auth(); // v4: getServerSession wrapper

  return (
    <header className="navbar bg-base-100 shadow-sm">
      {/* Left: logo */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl lowercase rounded-md">
          travel planner
        </Link>
      </div>

      {/* Right: nav + auth */}
      <nav className="flex-none gap-2 mr-2">
        <ul className="menu menu-horizontal px-1 items-center gap-2">
          <li>
            <Link href="/trips" className="opacity-80 hover:opacity-100">
              My Trips
            </Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            {/* Swaps between Log in / Sign out */}
            <AuthButton isAuthed={!!session?.user} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
