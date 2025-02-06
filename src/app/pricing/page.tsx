'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth',
    priceMonthly: '$99',
    description: 'Perfect for small teams getting started with AI.',
    features: [
      'Up to 5 team members',
      '10,000 API calls per month',
      'Basic RAG capabilities',
      'Email support',
      'Basic analytics',
      'Community access',
    ],
    featured: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/auth',
    priceMonthly: '$299',
    description: 'Ideal for growing businesses scaling their AI operations.',
    features: [
      'Up to 20 team members',
      '50,000 API calls per month',
      'Advanced RAG with custom models',
      'Priority email & chat support',
      'Advanced analytics & reporting',
      'API access',
      'Custom integrations',
      'Training sessions',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/auth',
    priceMonthly: 'Custom',
    description: 'Dedicated support & infrastructure for large organizations.',
    features: [
      'Unlimited team members',
      'Unlimited API calls',
      'Custom RAG architecture',
      '24/7 phone & email support',
      'Advanced security features',
      'Custom model training',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
    ],
    featured: false,
  },
];

const faqs = [
  {
    question: 'What forms of payment do you accept?',
    answer: 'We accept all major credit cards, wire transfers, and can arrange custom payment terms for enterprise customers.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, we offer a 14-day free trial for our Starter and Professional plans. Enterprise customers can arrange custom trial terms.',
  },
  {
    question: 'What kind of support is included?',
    answer: 'All plans include email support. Professional plans add priority support and training sessions, while Enterprise plans include 24/7 support and a dedicated account manager.',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PricingPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold leading-7 text-blue-600"
          >
            Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          >
            Choose the right plan for your team
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Simple, transparent pricing that grows with you. All plans include core features.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12"
        >
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured
                  ? 'ring-2 ring-blue-600'
                  : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.featured ? 'text-blue-600' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
                {tier.featured && (
                  <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                    Most popular
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                {tier.name !== 'Enterprise' && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
                    : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300',
                  'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                )}
              >
                {tier.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* FAQs */}
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold leading-10 tracking-tight text-gray-900"
          >
            Frequently asked questions
          </motion.h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="pt-6"
              >
                <dt className="text-lg font-semibold leading-7 text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-32 rounded-3xl bg-gray-900 py-16 sm:py-24 xl:py-32"
        >
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your business?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Start your free trial today. No credit card required.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/auth"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </a>
                <a href="/product" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 