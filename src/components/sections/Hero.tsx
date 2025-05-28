'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative isolate px-6 lg:px-8 min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-950 via-dark-green to-gray-950">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-green to-emerald-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
          style={{ 
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' 
          }} 
        />
      </div>
      
      {/* Existing content centered vertically */}
      <div className="flex-grow flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
            The AI-Native Decision Engine for Finance
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
          Arcta unifies siloed financial data, automates workflows, and learns your strategy—so you can make smarter decisions, faster.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link
              href="#workflow-animation"
              className="rounded-md bg-primary-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              See How It Works
            </Link>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-green to-emerald-900 opacity-20 sm:left-[calc(50%+15rem)] sm:w-[72.1875rem]" 
          style={{ 
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' 
          }}
        />
      </div>
    </div>
  );
} 