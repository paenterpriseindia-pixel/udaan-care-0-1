import { encode, decode } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET || "udaan-care-secret-change-in-prod";

/**
 * Generates a stateless reset token that is single-use.
 * By embedding a slice of the user's current password hash or PIN, 
 * the token is automatically invalidated as soon as the password is changed.
 */
export async function generateResetToken(userId: string, currentHashOrPin: string, role: "ADMIN" | "PARENT") {
  // We use next-auth's encode to create a secure encrypted JWT
  const token = await encode({
    token: {
      userId,
      role,
      validator: currentHashOrPin.substring(0, 10), // only need a slice to validate state change
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes expiration
    },
    secret: SECRET,
  });
  return token;
}

export async function verifyResetToken(token: string) {
  try {
    const decoded = await decode({ token, secret: SECRET });
    if (!decoded) return null;
    
    // Check expiration manually just in case
    if (decoded.exp && typeof decoded.exp === 'number' && Date.now() / 1000 > decoded.exp) {
      return null;
    }

    return {
      userId: decoded.userId as string,
      role: decoded.role as "ADMIN" | "PARENT",
      validator: decoded.validator as string,
    };
  } catch (error) {
    console.error("[resetTokens] Validation error:", error);
    return null;
  }
}
