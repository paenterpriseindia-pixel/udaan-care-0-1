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
  zoomLink?: string;
}

export function BookingConfirmationEmail({
  clientName,
  confirmationNumber,
  date,
  time,
  sessionType,
  zoomLink,
}: BookingConfirmationProps) {
  const logoUrl = 'https://fbogcjvivaehpsgabtqv.supabase.co/storage/v1/object/public/images/logo/logo-dark.png';

  return (
    <Html>
      <Head />
      <Preview>Your UdaanCare booking is confirmed - {date}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img src={logoUrl} width="160" alt="UdaanCare" style={logo} />
          </Section>

          {/* Banner */}
          <Section style={bannerSection}>
            <Text style={bannerTitle}>Booking Confirmed</Text>
            <Text style={bannerSubtitle}>We are excited to support you on this journey.</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={greeting}>Hi {clientName},</Text>
            <Text style={text}>
              Thank you for choosing UdaanCare. Your {sessionType.toLowerCase()} session has been successfully booked and confirmed. Please find your appointment details below.
            </Text>

            {/* Details Card */}
            <Section style={detailsCard}>
              <Text style={cardTitle}>Appointment Details</Text>
              
              <Section style={detailRow}>
                <Text style={detailLabel}>Patient Name</Text>
                <Text style={detailValue}>{clientName}</Text>
              </Section>
              
              <Section style={detailRow}>
                <Text style={detailLabel}>Confirmation No.</Text>
                <Text style={detailValue}>{confirmationNumber}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Date</Text>
                <Text style={detailValue}>{date}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Time</Text>
                <Text style={detailValue}>{time} IST</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Session Type</Text>
                <Text style={detailValue}>{sessionType}</Text>
              </Section>

              <Section style={detailRowLast}>
                <Text style={detailLabel}>Payment Status</Text>
                <Text style={paymentValue}>Paid</Text>
              </Section>
            </Section>

            {/* What to expect */}
            <Section style={infoSection}>
              <Text style={infoTitle}>What to expect next?</Text>
              
              {zoomLink ? (
                <>
                  <Text style={infoText}>
                    You have successfully booked an <strong>Online Consultation</strong>. Click the button below to join the Zoom meeting at your scheduled time.
                  </Text>
                  <a href={zoomLink} style={zoomButton} target="_blank" rel="noopener noreferrer">
                    Join Zoom Meeting
                  </a>
                </>
              ) : (
                <Text style={infoText}>
                  • If you booked an <strong>Online Consultation</strong>, Dr. Prasoon will share a Zoom link via WhatsApp shortly before the session.<br/><br/>
                  • If you booked a <strong>Clinic Visit</strong>, please arrive 10 minutes early at our Katni clinic.
                </Text>
              )}
            </Section>

            {/* Reschedule */}
            <Section style={infoSection}>
              <Text style={infoTitle}>Need to reschedule?</Text>
              <Text style={infoText}>
                We understand that plans change. If you need to reschedule or cancel, please contact us at least 24 hours in advance via WhatsApp or email.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Img src={logoUrl} width="120" alt="UdaanCare" style={footerLogo} />
            <Text style={footerContact}>
              <strong>UdaanCare Pediatric Therapy</strong><br/>
              Katni, Madhya Pradesh<br/>
              <a href="mailto:prasoon@udaancare.in" style={link}>prasoon@udaancare.in</a> | +91 8349764084
            </Text>
            <Text style={footerCopyright}>
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
  backgroundColor: '#f3f4f6',
  fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  maxWidth: '600px',
  overflow: 'hidden',
};

const header = {
  padding: '32px 32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
};

const logo = {
  margin: '0 auto',
};

const bannerSection = {
  backgroundColor: '#1AAFE6',
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const bannerTitle = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#ffffff',
  margin: '0',
  fontFamily: '"Nunito", sans-serif',
};

const bannerSubtitle = {
  fontSize: '16px',
  color: '#e0f2fe',
  margin: '8px 0 0 0',
};

const contentSection = {
  padding: '40px 32px',
};

const greeting = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 16px 0',
  fontFamily: '"Nunito", sans-serif',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 24px 0',
};

const detailsCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '32px',
};

const cardTitle = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#64748b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 16px 0',
};

const detailRow = {
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '12px',
  marginBottom: '12px',
};

const detailRowLast = {
  paddingBottom: '0',
  marginBottom: '0',
};

const detailLabel = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0 0 4px 0',
};

const detailValue = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0f172a',
  margin: '0',
};

const paymentValue = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#10b981', // Success green
  margin: '0',
};

const infoSection = {
  marginBottom: '24px',
};

const infoTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 8px 0',
  fontFamily: '"Nunito", sans-serif',
};

const infoText = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const zoomButton = {
  backgroundColor: '#1AAFE6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'inline-block',
  marginTop: '16px',
  fontFamily: '"Nunito", sans-serif',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '32px',
  textAlign: 'center' as const,
};

const footerLogo = {
  margin: '0 auto 16px',
  opacity: 0.5,
  filter: 'grayscale(100%)',
};

const footerContact = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const link = {
  color: '#1AAFE6',
  textDecoration: 'none',
};

const footerCopyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
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
