// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ? "font-semibold text-primary" : "opacity-80";

  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl lowercase rounded-md">
          travel planner
        </Link>
      </div>

      <nav className="flex-none gap-2 mr-2">
        <ul className="menu menu-horizontal px-1 items-center gap-2">
          <li>
            <Link href="/trips" className={isActive("/trips")}>
              My Trips
            </Link>
          </li>

          {/* Theme toggle */}
          <li>
            <ThemeToggle />
          </li>

          {/* Placeholder auth button */}
          <li>
            <button className="btn btn-primary btn-sm rounded-md">
              Log in
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
