import { render } from '@react-email/components';
import { BookingConfirmationEmail } from '../src/lib/email';
import * as fs from 'fs';

async function main() {
  const html = await render(
    <BookingConfirmationEmail 
      clientName="Arjun Sharma"
      confirmationNumber="UC-8F9B2A"
      date="2026-07-02"
      time="10:00"
      sessionType="Online Consultation"
    />,
    {
      pretty: true,
    }
  );

  const outputPath = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\fdd56249-9f4f-44e1-b0f8-72613b661640\\email_preview.html';
  fs.writeFileSync(outputPath, html);
  console.log('HTML saved to', outputPath);
}

main().catch(console.error);
