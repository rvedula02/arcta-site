'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40 lg:px-8 lg:pt-44">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Data into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Intelligent Insights
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Arcta AI combines the power of RAG (Retrieval-Augmented Generation) with agentic AI to help you make better decisions, faster. Turn your unstructured data into actionable intelligence.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/get-started"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/demo"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
            >
              Live demo <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-16 max-w-7xl px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 border-y border-gray-900/10">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Advanced RAG', description: 'State-of-the-art retrieval for precise information access' },
                { name: 'Agentic AI', description: 'Autonomous agents that understand and act on your data' },
                { name: 'Enterprise Ready', description: 'Built for scale with security and compliance in mind' },
              ].map((feature) => (
                <div key={feature.name} className="text-center">
                  <dt className="text-base font-semibold leading-7 text-gray-900">{feature.name}</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
} 