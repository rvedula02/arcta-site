import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check if prisma is available
    if (!prisma) {
      console.error('Database connection not available');
      return NextResponse.json({ message: 'Database connection not available' }, { status: 500 });
    }

    const payload = await req.json();

    console.log('Received Calendly Webhook Payload:', JSON.stringify(payload, null, 2));

    // Check if it's an invitee created event
    if (payload.event === 'invitee.created') {
      const inviteeEmail = payload.payload?.email;
      const eventStartTime = payload.payload?.scheduled_event?.start_time;
      const eventUri = payload.payload?.scheduled_event?.uri;

      if (inviteeEmail && eventStartTime && eventUri) {
        // Find demo request by email and update with booking details
        // Only update requests that don't already have booking information
        const updatedRequests = await prisma.demoRequest.updateMany({
          where: { 
            email: inviteeEmail.toLowerCase().trim(),
            bookedTime: null // Only update requests without existing bookings
          },
          data: {
            bookedTime: new Date(eventStartTime),
            meetingLink: eventUri,
            status: 'booked'
          },
        });

        if (updatedRequests.count > 0) {
          console.log(`Updated ${updatedRequests.count} demo request(s) for email: ${inviteeEmail}`);
        } else {
          console.log(`No pending demo requests found for email: ${inviteeEmail}`);
        }
      } else {
        console.warn('Missing required fields in Calendly payload.');
      }
    } else if (payload.event === 'invitee.canceled') {
      // Handle cancellations
      const inviteeEmail = payload.payload?.email;
      const eventUri = payload.payload?.scheduled_event?.uri;

      if (inviteeEmail && eventUri) {
        const updatedRequests = await prisma.demoRequest.updateMany({
          where: { 
            email: inviteeEmail.toLowerCase().trim(),
            meetingLink: eventUri
          },
          data: {
            status: 'cancelled',
            bookedTime: null,
            meetingLink: null
          },
        });

        if (updatedRequests.count > 0) {
          console.log(`Cancelled ${updatedRequests.count} demo request(s) for email: ${inviteeEmail}`);
        }
      }
    } else {
      console.log(`Received event: ${payload.event}`);
    }

    // Respond to Calendly quickly to acknowledge receipt
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });

  } catch (error) {
    console.error('Error processing Calendly webhook:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error processing webhook', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error processing webhook' }, { status: 500 });
  }
}

// Optional: Add security by verifying the webhook signature
// const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
// You'd get this key from the Calendly webhook setup page.
// You'd need to compare the signature in the `Calendly-Webhook-Signature` header
// with a signature you compute based on the key and the request body.
// Libraries like `crypto` can be used for this.
// Example (Conceptual - requires proper implementation):
/*
import crypto from 'crypto';

async function verifySignature(req: NextRequest, body: string) {
  if (!CALENDLY_WEBHOOK_SIGNING_KEY) {
    console.warn('Calendly signing key not configured. Skipping verification.');
    return true; // Or false if you want to enforce verification
  }

  const signatureHeader = req.headers.get('Calendly-Webhook-Signature');
  if (!signatureHeader) {
    console.error('Missing Calendly signature header');
    return false;
  }

  const [t, v1] = signatureHeader.split(',');
  const timestamp = t?.split('=')[1];
  const signature = v1?.split('=')[1];

  if (!timestamp || !signature) {
    console.error('Invalid signature header format');
    return false;
  }

  const signedPayload = `${timestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', CALENDLY_WEBHOOK_SIGNING_KEY)
    .update(signedPayload)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
     console.error('Invalid Calendly signature');
     return false;
  }

  // Optional: Check timestamp to prevent replay attacks
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() - parseInt(timestamp, 10) * 1000 > fiveMinutes) {
      console.error('Calendly webhook timestamp validation failed (too old).');
      return false;
  }


  return true;
}

// Inside POST handler:
// const rawBody = await req.text(); // Need raw body for signature verification
// const isValid = await verifySignature(req, rawBody);
// if (!isValid) {
//   return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
// }
// const payload = JSON.parse(rawBody); // Parse JSON *after* verification
*/ 