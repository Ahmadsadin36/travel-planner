// components/AuthButton.tsx
"use client";
import { signIn, signOut } from "next-auth/react";
export default function AuthButton({ isAuthed }: { isAuthed: boolean }) {
  return isAuthed ? (
    <button
      className="btn btn-success btn-sm rounded-md"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  ) : (
    <button
      className="btn btn-primary btn-sm rounded-md"
      onClick={() => signIn("github")}
    >
      Log in
    </button>
  );
}
