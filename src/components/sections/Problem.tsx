import React from 'react';

export default function Problem() {
  return (
    <div className="py-24 sm:py-32 border-t border-gray-700 pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-400">The Problem</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Inefficient Data Management in Financial Offices
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-100">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Time-Consuming Manual Work
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                Analysts spend countless hours running repetitive queries, reformatting data, and creating standardized reports.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-100">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                </div>
                Inefficient Workflows
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                Current processes involve multiple manual steps, leading to delays and potential errors in financial analysis and reporting.
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 