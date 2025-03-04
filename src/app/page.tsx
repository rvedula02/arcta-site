import Hero from '@/components/sections/Hero';
import Solution from '@/components/sections/Solution';

const features = [
  {
    name: 'Data Ingestion',
    description: 'File-agnostic drag-and-drop upload with automated data pipelines and secure storage/encryption.',
    icon: '📥',
  },
  {
    name: 'Unified Intelligence Platform',
    description: 'Search, fetch, and rank relevant company data, generate real-time insights and trends, and create custom dashboards.',
    icon: '🧠',
  },
  {
    name: 'Workflow Automation',
    description: 'Context-based workflow prediction and personalized workflow graph creation with custom RL fine-tuning.',
    icon: '⚡',
  },
  {
    name: 'Real-time Analytics',
    description: 'Generate insights, trends, and charts in real-time from your unified data platform.',
    icon: '📊',
  },
  {
    name: 'Custom Workflows',
    description: "Ground truth and custom workflows that adapt to your investment office's specific needs.",
    icon: '🔄',
  },
  {
    name: 'Secure Infrastructure',
    description: 'Enterprise-grade security for your sensitive financial data and operations.',
    icon: '🔒',
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Solution />

      {/* Features section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Core Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Engineering Organizational Intelligence
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Crafting AI systems to empower low-tech organizations with unified and elegant intelligence.
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
            className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-emerald-300 to-emerald-500 opacity-25"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Speak to your data
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            We're re-imagining data and workflows with AI-driven solutions - enabling seamless dialogue for investment professionals with data of any kind.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/demo"
              className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Request a Demo
            </a>
            <a href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              Contact Us <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
