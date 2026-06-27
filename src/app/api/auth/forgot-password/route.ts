import { NextResponse } from "next/server";
import { UserDB, PatientDB } from "@/lib/db";
import { generateResetToken } from "@/lib/resetTokens";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailHtml = (resetUrl: string, name: string) => `
<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
  <h2 style="color: #0A7E8C;">Password Reset Request</h2>
  <p>Hello ${name},</p>
  <p>We received a request to reset the password for your Udaan Care account. If you didn't make this request, you can safely ignore this email.</p>
  <p>To reset your password, click the secure link below. This link will expire in 15 minutes.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background-color: #0A7E8C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
      Reset Password
    </a>
  </div>
  <p style="font-size: 12px; color: #888;">Or copy and paste this link into your browser:<br/>${resetUrl}</p>
  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
  <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Udaan Care. All rights reserved.</p>
</div>
`;
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
        
        await resend.emails.send({
          from: "Udaan Care <prasoon@udaancare.in>",
          to: email,
          subject: "Reset your Udaan Care Password",
          html: emailHtml(resetUrl, user.name),
        });
        console.log(`[Forgot Password] Sent Admin Reset email to ${email}`);
      }
    } else if (role === "PARENT") {
      // For parents, we find the patient by guardianEmail
      const allPatients = await PatientDB.getAll();
      const patient = allPatients.find(p => p.guardianEmail === email);
      
      if (patient) {
        const token = await generateResetToken(patient.id, patient.guardianPin, "PARENT");
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/reset-password?token=${encodeURIComponent(token)}`;
        
        await resend.emails.send({
          from: "Udaan Care <prasoon@udaancare.in>",
          to: email,
          subject: "Reset your Udaan Care Parent Portal PIN",
          html: emailHtml(resetUrl, patient.guardianName),
        });
        console.log(`[Forgot Password] Sent Parent Reset email to ${email}`);
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
