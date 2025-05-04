import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import path if necessary
import crypto from 'crypto';
import { parseISO } from 'date-fns';

// Ensure you have your Calendly Webhook Signing Key in environment variables
const CALENDLY_WEBHOOK_SECRET = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

export async function POST(request: Request) {
  console.log("Calendly webhook received...");

  if (!CALENDLY_WEBHOOK_SECRET) {
    console.error('Calendly webhook secret is not configured.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const headers = request.headers;
    const calendlySignature = headers.get('calendly-webhook-signature');

    if (!calendlySignature) {
      console.warn("Missing Calendly webhook signature");
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify the webhook signature
    const signatureHeader = calendlySignature.split(',').reduce((acc, part) => {
        const [key, value] = part.split('=');
        if (key && value) {
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {} as { [key: string]: string });

    const t = signatureHeader?.t; // Access 't' timestamp
    const signature = signatureHeader?.v1; // Access 'v1' signature

    if (!t || !signature) {
      console.warn("Invalid Calendly signature format");
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 400 });
    }

    const signedPayload = `${t}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', CALENDLY_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn("Invalid Calendly signature");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Signature is valid, parse the payload
    const payload = JSON.parse(rawBody);
    console.log("Calendly Payload:", JSON.stringify(payload, null, 2)); // Log the full payload for inspection

    // Handle only the 'invitee.created' event
    if (payload.event === 'invitee.created') {
      console.log("Handling invitee.created event...");
      const inviteeEmail = payload.payload?.email;
      // --- IMPORTANT: Check the logged payload to confirm these paths --- 
      const eventStartTime = payload.payload?.scheduled_event?.start_time; 
      const eventUri = payload.payload?.scheduled_event?.uri;         
      // --- 

      if (!inviteeEmail || !eventStartTime || !eventUri) {
        console.warn("Missing required fields in Calendly payload", { inviteeEmail, eventStartTime, eventUri });
        return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 });
      }

      console.log(`Attempting to update user: ${inviteeEmail} with booking time: ${eventStartTime}`);

      // Find user by email and update their booking info
      const updatedUser = await prisma.user.update({
        where: { email: inviteeEmail },
        data: {
          demoBookingTime: parseISO(eventStartTime), // Convert ISO string to DateTime
          demoBookingUri: eventUri,
        },
      });

      if (updatedUser) {
        console.log(`Successfully updated booking info for user: ${inviteeEmail}`);
      } else {
        console.warn(`User not found for email: ${inviteeEmail}`);
        // Decide if you want to error out or just log if the user isn't found
      }
    } else {
      console.log(`Ignoring Calendly event type: ${payload.event}`);
    }

    // Respond to Calendly
    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing Calendly webhook:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 