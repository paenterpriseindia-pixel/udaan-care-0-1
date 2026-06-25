import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore - session.user.role exists from authOptions
  if (session.user.role !== "ADMIN" && session.user.role !== "DOCTOR") {
    throw new Error("Forbidden: Admin or Doctor access required");
  }
  return session;
}

export async function requireParent() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  if (session.user.role !== "PARENT") {
    throw new Error("Forbidden: Parent portal access required");
  }
  return session;
}
