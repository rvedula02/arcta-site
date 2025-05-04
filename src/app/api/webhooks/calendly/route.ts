import { NextRequest, NextResponse } from 'next/server';
// Import the shared Prisma client instance
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log('Received Calendly Webhook Payload:', JSON.stringify(payload, null, 2));

    // Check if it's an invitee created event
    if (payload.event === 'invitee.created') {
      const inviteeEmail = payload.payload?.email;
      const eventStartTime = payload.payload?.scheduled_event?.start_time;
      const eventUri = payload.payload?.scheduled_event?.uri; // Or maybe payload.payload.event.uri depending on structure

      if (inviteeEmail && eventStartTime && eventUri) {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: inviteeEmail },
        });

        if (user) {
          // Update user with booking details
          await prisma.user.update({
            where: { id: user.id },
            data: {
              demoBookingTime: new Date(eventStartTime), // Convert string to Date
              demoBookingUri: eventUri,
            },
          });
          console.log(`Updated demo booking info for user: ${inviteeEmail}`);
        } else {
          console.log(`No registered user found for email: ${inviteeEmail}`);
          // Decide if you want to handle non-registered users, e.g., store in DemoRequest?
        }
      } else {
         console.warn('Missing required fields in Calendly payload.');
      }
    } else {
         console.log(`Received non-invitee.created event: ${payload.event}`);
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