// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/auth";

// v4 handler for both GET/POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
