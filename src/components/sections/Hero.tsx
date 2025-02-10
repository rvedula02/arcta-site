'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="flex">
            <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <span className="font-semibold text-emerald-600">Financial Analytics Market</span>
              <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
              <a href="/market" className="flex items-center gap-x-1">
                Valued at $9.73bn in 2024
                <span className="absolute inset-0" aria-hidden="true" />
              </a>
            </div>
          </div>
          <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Transforming the way Investment Offices work
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Speak to your data. We're re-imagining data and workflows with AI-driven solutions - from actionable insights and intuitive visualizations to workflow automation, enabling seamless dialogue for investment professionals with data of any kind.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="/demo"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Request a Demo
            </a>
            <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <div className="relative mx-auto w-full max-w-lg">
            {/* Decorative image grid */}
            <div className="absolute -top-8 left-1/2 -ml-24 transform-gpu blur-3xl lg:top-auto lg:-ml-32 lg:left-[calc(50%-12rem)]" aria-hidden="true">
              <div
                className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-emerald-300 to-emerald-600 opacity-20"
                style={{
                  clipPath:
                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                }}
              />
            </div>
            {/* Platform preview image */}
            <img
              src="/platform-preview.png"
              alt="Arcta Platform Interface"
              className="relative rounded-xl shadow-xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 