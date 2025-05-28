import React from 'react';
import DemoRequestForm from '@/components/DemoRequestForm';

export default function DemoPage() {
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Request Your Demo</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Get a personalized demonstration of Arcta&apos;s AI-powered platform. Fill out the form below and we&apos;ll schedule a demo that fits your needs.
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <DemoRequestForm />
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