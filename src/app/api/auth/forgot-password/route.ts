import { NextResponse } from "next/server";
import { UserDB, PatientDB } from "@/lib/db";
import { generateResetToken } from "@/lib/resetTokens";

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();
    
    if (!email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role === "ADMIN") {
      const user = await UserDB.getByEmail(email);
      if (user) {
        const token = await generateResetToken(user.id, user.passwordHash, "ADMIN");
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reset-password?token=${encodeURIComponent(token)}`;
        
        // TODO: In a real app, send an email here using Resend/Nodemailer
        console.log(`[Forgot Password] Admin Reset URL for ${email}: ${resetUrl}`);
      }
    } else if (role === "PARENT") {
      // For parents, we find the patient by guardianEmail
      const allPatients = await PatientDB.getAll();
      const patient = allPatients.find(p => p.guardianEmail === email);
      
      if (patient) {
        const token = await generateResetToken(patient.id, patient.guardianPin, "PARENT");
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/reset-password?token=${encodeURIComponent(token)}`;
        
        // TODO: In a real app, send an email here
        console.log(`[Forgot Password] Parent Reset URL for ${email}: ${resetUrl}`);
      }
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Always return a success message to prevent user enumeration
    return NextResponse.json({ message: "If an account exists, a reset link has been sent to the email." });
  } catch (error) {
    console.error("[Forgot Password API Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
