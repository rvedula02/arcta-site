'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Placeholder components for logos - replace with actual SVGs/Images later
const OpenAILogo = () => <span className="text-xl font-semibold">OpenAI</span>;
const GeminiLogo = () => <span className="text-xl font-semibold">Gemini</span>;

export default function Hero() {
  return (
    <div className="relative isolate px-6 lg:px-8 min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-950 via-dark-green to-gray-950">
      {/* Existing content centered vertically */}
      <div className="flex-grow flex flex-col justify-center">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          {/* Optional: Add a subtle gradient shape like modelml.com if desired */}
          {/* <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#025353] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(...)' }} /> */}
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
            The AI-native Decision Engine for Finance
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Empowering enterprise finance teams with an AI-driven workspace designed for complex data analysis and workflow automation.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link
              href="#workflow-animation"
              className="rounded-md bg-primary-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              See How It Works
            </Link>
          </div>
        </div>
        {/* Optional: Add another background element if needed */}
        {/* <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">...</div> */}
      </div>

      {/* Trusted Partners Section - Positioned near the bottom */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-10 pt-5 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
          <span className="text-sm font-semibold text-gray-400">Our trusted partners</span>
          <div className="flex items-center justify-center gap-x-8">
            <OpenAILogo /> 
            <GeminiLogo />
          </div>
        </div>
      </div>
    </div>
  );
} 