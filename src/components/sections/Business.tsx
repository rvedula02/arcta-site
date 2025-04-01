import React from 'react';

export default function Business() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Business Model</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                Business Model
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                B2B SaaS Subscription: $1,000 per user per month
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Target Customers: Small to medium size hedge funds, private equity firms, family offices and other financial offices
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                Pricing Justification
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Industry data solutions (Palantir, Bloomberg) charge $1500-$3,000 per user per month
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Competitively priced to provide value for less cost.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                Scalability
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                MVP Focus: High-touch sales with hedge funds, FOs & PE firms
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Future Growth: Automate sales & expand to other industries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 