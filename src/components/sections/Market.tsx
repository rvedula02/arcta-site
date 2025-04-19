import React from 'react';

export default function Market() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Market Landscape</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Financial Data Analytics and Workflow Automation Verticals
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-8 text-center lg:grid-cols-3 lg:gap-x-8">
            <div className="relative">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                Total Addressable Market (TAM)
              </dt>
              <dd className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-emerald-600">$24.7B</span>
                <p className="mt-2 text-base leading-7 text-gray-600">16.35% CAGR</p>
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                Serviceable Addressable Market (SAM)
              </dt>
              <dd className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-emerald-600">$15.5B</span>
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                Serviceable Obtainable Market (SOM)
              </dt>
              <dd className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-emerald-600">$775M</span>
              </dd>
            </div>
          </div>
          <div className="mt-16 text-center text-sm text-gray-600">
            <p>*Fortune Business Insights</p>
            <p>*Verified Market Research</p>
          </div>
        </div>
      </div>
    </div>
  );
} 