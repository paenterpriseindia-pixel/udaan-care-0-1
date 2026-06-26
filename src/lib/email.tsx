import { Resend } from 'resend';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
  Preview,
} from '@react-email/components';
import React from 'react';

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

interface BookingConfirmationProps {
  clientName: string;
  confirmationNumber: string;
  date: string;
  time: string;
  sessionType: string;
}

export function BookingConfirmationEmail({
  clientName,
  confirmationNumber,
  date,
  time,
  sessionType,
}: BookingConfirmationProps) {
  // Use a public absolute URL for the logo inside the email
  const logoUrl = 'https://fbogcjvivaehpsgabtqv.supabase.co/storage/v1/object/public/images/logo/logo-dark.png';

  return (
    <Html>
      <Head />
      <Preview>Your booking with UdaanCare is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={logoUrl} width="200" alt="UdaanCare Logo" style={logo} />
          </Section>

          <Section style={contentSection}>
            <Text style={title}>Booking Confirmation</Text>
            
            <Text style={text}>Hi {clientName},</Text>
            
            <Text style={text}>
              Thank you for booking with UdaanCare. Your session has been successfully logged. Please keep this email for your reference. Our team looks forward to supporting you.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailRow}><strong>Confirmation Number:</strong> {confirmationNumber}</Text>
              <Text style={detailRow}><strong>Date:</strong> {date}</Text>
              <Text style={detailRow}><strong>Time:</strong> {time}</Text>
              <Text style={detailRow}><strong>Session Type:</strong> {sessionType}</Text>
              <Text style={detailRow}><strong>Payment Status:</strong> Pending Verification</Text>
            </Section>

            <Text style={text}>
              Note: If you have already paid via UPI, Dr. Prasoon will verify it and confirm your slot shortly via WhatsApp.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Reply to this email or contact us at <a href="mailto:support@udaancare.in" style={link}>support@udaancare.in</a>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} UdaanCare. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  maxWidth: '600px',
  overflow: 'hidden',
};

const header = {
  padding: '32px 32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #eaeaea',
};

const logo = {
  margin: '0 auto',
};

const contentSection = {
  padding: '32px',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0A7E8C',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
};

const detailsBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const detailRow = {
  fontSize: '15px',
  lineHeight: '1.5',
  color: '#1e293b',
  margin: '8px 0',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '0',
};

const footer = {
  backgroundColor: '#fafafa',
  padding: '24px 32px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const link = {
  color: '#0A7E8C',
  textDecoration: 'none',
};

export async function sendBookingEmail(to: string, props: BookingConfirmationProps) {
  if (!resend) {
    console.log('[Email Mock] Sending email to:', to, 'Props:', props);
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'UdaanCare <prasoon@udaancare.in>',
      to,
      subject: `Booking Confirmation: ${props.sessionType} - ${props.confirmationNumber}`,
      react: <BookingConfirmationEmail {...props} /> as React.ReactElement,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return { ok: false, error };
    }
    return { ok: true, data };
  } catch (err) {
    console.error('[Resend Exception]', err);
    return { ok: false, error: err };
  }
}
