'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { InlineWidget } from 'react-calendly';
import { format } from 'date-fns'; // For formatting the date/time

export default function DemoPage() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Define placeholders for Calendly custom question IDs
  const COMPANY_QUESTION_ID = 'a1'; // <-- Replace 'a1' with your actual Company question ID from Calendly
  const NEEDS_QUESTION_ID = 'a2';   // <-- Replace 'a2' with your actual Needs Description question ID from Calendly

  // Function to format the date and time nicely
  const formatBookingTime = (date: Date | null | undefined) => {
    if (!date) return '';
    try {
        // Example format: Tuesday, May 7, 2025 at 10:00 AM
        return format(date, "EEEE, MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
    }
  };

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-300 to-emerald-600 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Book Your Demo</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            {status === 'authenticated' && session?.user?.demoBookingTime
              ? 'Your demo is scheduled. See details below.'
              : 'Schedule a time that works best for you using the calendar below.'}
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          {isLoading ? (
            <div className="text-center py-10">Loading...</div> // Show loading state
          ) : status === 'authenticated' && session?.user?.demoBookingTime ? (
            // Show booking confirmation for logged-in user with booking
            <div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Demo Scheduled!</strong>
              <p>Your meeting is confirmed for:</p>
              <p className="mt-2 text-lg font-medium">{formatBookingTime(session.user.demoBookingTime)}</p>
              {session.user.demoBookingUri && (
                 <p className="mt-2"><a href={session.user.demoBookingUri} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">View Calendly Event Details</a></p>
              )}
            </div>
          ) : (
            // Show Calendly widget for logged-out users or logged-in users without booking
            <InlineWidget
              url="https://calendly.com/tarunv711"
              styles={{
                height: '1000px',
              }}
              prefill={status === 'authenticated' && session?.user ? {
                email: session.user.email || '',
                firstName: session.user.firstName || '',
                lastName: session.user.lastName || '',
                name: `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim(), // Combine first/last for Calendly 'Name' field
                customAnswers: {
                  [COMPANY_QUESTION_ID]: session.user.company || '',
                  [NEEDS_QUESTION_ID]: session.user.needsDescription || '',
                }
              } : {}}
              pageSettings={{
                backgroundColor: 'ffffff',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: '00a2ff',
                textColor: '4d5055',
              }}
            />
          )}
        </div>

        <div className="mt-20 rounded-2xl bg-gray-50 p-8 max-w-xl mx-auto">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Why Choose Arcta?</h3>
          <dl className="mt-4 space-y-4">
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Feature</span>
                <svg className="h-7 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </dt>
              <dd className="text-sm leading-7 text-gray-600">
                Unified Intelligence Platform targeting low-tech financial institutions
              </dd>
            </div>
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Feature</span>
                <svg className="h-7 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </dt>
              <dd className="text-sm leading-7 text-gray-600">
                AI-enabled intuitive, real-time analytics of structured and unstructured information
              </dd>
            </div>
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Feature</span>
                <svg className="h-7 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </dt>
              <dd className="text-sm leading-7 text-gray-600">
                Vertical-specific AI Agents designed for investment workflows
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 