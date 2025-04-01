import React from 'react';

export default function Solution() {
  const steps = [
    {
      name: 'Data Ingestion',
      description: 'Seamlessly import data from various sources including emails, cloud storage, PDFs, and spreadsheets.',
      icon: '📥'
    },
    {
      name: 'Knowledge Base',
      description: 'AI-powered system that learns and understands your financial data and processes.',
      icon: '🧠'
    },
    {
      name: 'Workflow Automation',
      description: 'Automated processes for data analysis, reporting, and decision-making.',
      icon: '⚡'
    }
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">The Solution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Intelligent Automation Platform
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform streamlines financial operations through AI-driven automation, eliminating repetitive tasks and enhancing productivity.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <span className="text-2xl">{step.icon}</span>
                  {step.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-16 flex justify-center">
          <p className="text-center text-lg font-semibold text-emerald-600">
            ingest → retrieve → automate → repeat
          </p>
        </div>
      </div>
    </div>
  );
} 