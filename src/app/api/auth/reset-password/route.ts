import { NextResponse } from "next/server";
import { UserDB, PatientDB } from "@/lib/db";
import { verifyResetToken } from "@/lib/resetTokens";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const decoded = await verifyResetToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    if (decoded.role === "ADMIN") {
      const user = await UserDB.getById(decoded.userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Verify token wasn't already used (validator must match current hash)
      if (user.passwordHash.substring(0, 10) !== decoded.validator) {
        return NextResponse.json({ error: "Token has already been used" }, { status: 400 });
      }

      // Hash new password and save
      const newHash = await bcrypt.hash(newPassword, 10);
      await UserDB.update(user.id, { passwordHash: newHash });
      console.log(`[Reset Password] Password reset successfully for Admin: ${user.email}`);

    } else if (decoded.role === "PARENT") {
      const patient = await PatientDB.getById(decoded.userId);
      if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }

      // Verify token wasn't already used (validator must match current pin)
      if (patient.guardianPin.substring(0, 10) !== decoded.validator) {
        return NextResponse.json({ error: "Token has already been used" }, { status: 400 });
      }

      // Save new PIN (no hashing for PIN in this implementation)
      await PatientDB.update(patient.id, { guardianPin: newPassword });
      console.log(`[Reset Password] PIN reset successfully for Patient: ${patient.uniqueId}`);
    } else {
      return NextResponse.json({ error: "Invalid role in token" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("[Reset Password API Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
