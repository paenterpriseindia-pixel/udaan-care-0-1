import NextAuth from "next-auth";
import { authOptions, seedDefaultAdmin } from "@/lib/auth";

// Seed default admin user on first API call
seedDefaultAdmin().catch(console.error);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
