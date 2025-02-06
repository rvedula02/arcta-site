import Hero from '@/components/sections/Hero';

const features = [
  {
    name: 'Advanced RAG Architecture',
    description: 'Our state-of-the-art Retrieval-Augmented Generation system ensures precise and contextually relevant information retrieval.',
    icon: '🔍',
  },
  {
    name: 'Agentic AI Capabilities',
    description: 'Autonomous agents that understand context, learn from interactions, and take intelligent actions on your data.',
    icon: '🤖',
  },
  {
    name: 'Enterprise Security',
    description: 'Built with enterprise-grade security and compliance features to protect your sensitive data.',
    icon: '🔒',
  },
  {
    name: 'Seamless Integration',
    description: 'Easy integration with your existing tools and workflows through our comprehensive API.',
    icon: '🔄',
  },
  {
    name: 'Scalable Infrastructure',
    description: 'Cloud-native architecture that scales with your needs, from startups to enterprise deployments.',
    icon: '📈',
  },
  {
    name: 'Real-time Analytics',
    description: 'Monitor and analyze system performance, usage patterns, and insights in real-time.',
    icon: '📊',
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />

      {/* Features section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Powerful Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to transform your data
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Arcta AI combines advanced RAG capabilities with agentic AI to deliver a comprehensive solution for enterprise data intelligence.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <span className="text-2xl">{feature.icon}</span>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-40 sm:py-40 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl">
          <div
            className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-25"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to transform your data?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join leading companies using Arcta AI to unlock the full potential of their data with advanced RAG and agentic AI.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/get-started"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started today
            </a>
            <a href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              Contact sales <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
