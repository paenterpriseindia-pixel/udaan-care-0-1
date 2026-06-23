import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserDB, PatientDB } from "./db";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "udaan-care-secret-change-in-prod",
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    // ── Admin / Doctor login ──
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const user = await UserDB.getByEmail(credentials.email);
          if (!user) { console.error("[auth] User not found:", credentials.email); return null; }
          if (user.role === "PARENT") { console.error("[auth] Parent tried admin login"); return null; }
          const ok = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!ok) { console.error("[auth] Wrong password for:", credentials.email, "hash:", user.passwordHash.substring(0, 15)); return null; }
          console.log("[auth] Login SUCCESS:", credentials.email, user.role);
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },

    }),

    // ── Parent portal login (Patient ID + 4-digit PIN) ──
    CredentialsProvider({
      id: "parent-credentials",
      name: "Parent Portal",
      credentials: {
        uniqueId: { label: "Patient ID", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.uniqueId || !credentials?.pin) return null;
        const patient = await PatientDB.getByUniqueId(credentials.uniqueId.toUpperCase().trim());
        if (!patient) return null;
        if (patient.guardianPin !== credentials.pin) return null;
        return {
          id: patient.id,
          email: patient.guardianEmail ?? `${patient.uniqueId}@portal.udaancare.in`,
          name: patient.guardianName,
          role: "PARENT",
          patientId: patient.id,
          patientUniqueId: patient.uniqueId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.patientId = (user as { patientId?: string }).patientId;
        token.patientUniqueId = (user as { patientUniqueId?: string }).patientUniqueId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { patientId?: string }).patientId = token.patientId as string;
        (session.user as { patientUniqueId?: string }).patientUniqueId = token.patientUniqueId as string;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};

// ── Seed default admin on first run ──
export async function seedDefaultAdmin() {
  try {
    const user = await UserDB.getByEmail("admin@udaancare.in");
    if (!user) {
      const hash = await bcrypt.hash("admin123", 10);
      await UserDB.create({
        email: "admin@udaancare.in",
        passwordHash: hash,
        name: "Admin",
        role: "ADMIN",
      });
      console.log("✅ Default admin created: admin@udaancare.in / admin123");
    }
  } catch {
    // Table may not exist yet - user needs to run SQL schema
  }
}
