import React from 'react';

export default function WhyNow() {
  const reasons = [
    {
      title: 'Technological Breakthrough',
      description: 'LLMs & agentic AI can now handle complex financial analysis & reporting.',
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Rapid Adoption',
      description: 'Major firms (JPMorgan, Bridgewater, etc.) are integrating AI for efficiency and the industry is following.',
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Rising Demand for Efficiency',
      description: 'Automation reduces manual work, cutting costs & boosting scalability.',
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Why Now?</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The Perfect Time for AI-Driven Financial Operations
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex flex-col items-start">
                <div className="rounded-lg bg-gray-50 p-2">
                  {reason.icon}
                </div>
                <dt className="mt-4 font-semibold text-gray-900">{reason.title}</dt>
                <dd className="mt-2 leading-7 text-gray-600">{reason.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 