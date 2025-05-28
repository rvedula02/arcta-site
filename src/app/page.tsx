import Hero from '../components/sections/Hero';
import AdvancedWorkflowAnimation from '../components/sections/AdvancedWorkflowAnimation';
import VideoDemo from '../components/sections/VideoDemo';

const features = [
  {
    name: 'Unified Chat for Financial Data',
    description: 'Ask questions across the entirety of firm data and get instant insights—no digging through PDFs or spreadsheets.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    name: 'Automated Workflows That Evolve',
    description: 'Turn insights into actions—automate dashboards, reports, and alerts in minutes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Your Strategy's Digital Twin",
    description: 'Arcta learns your patterns to predict next steps—your investment playbook, optimized.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="text-gray-300 relative">
      <Hero />
      <AdvancedWorkflowAnimation />
      <VideoDemo />

      {/* Features section - with full-width gradient background */}
      <div className="w-full bg-gradient-to-b from-dark-green to-gray-950 py-16">
        <div className="mx-auto max-w-7xl px-6 sm:mt-10 lg:px-8">
          <div className="mx-auto max-w-4xl lg:text-center mb-20">
            <h2 className="text-base font-semibold leading-7 text-emerald-400 text-center">Collapsing the distance between data and decision</h2>
            <p className="mt-6 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl text-center">
              Arcta's Decision Engine streamlines complex financial workflows—automating analysis, surfacing insights, and accelerating decisions that drive your firm's edge.
            </p>
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.slice(0, 3).map((feature) => (
                <div key={feature.name} className="flex flex-col items-center text-center rounded-xl p-8 bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-emerald-900/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-dark-green mb-6">
                    <div className="text-emerald-400">
                      {feature.icon}
                    </div>
                  </div>
                  <dt className="font-semibold text-gray-100 text-lg mb-4">
                    {feature.name}
                  </dt>
                  <dd className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section with seamless transition to footer */}
      <div className="w-full bg-gradient-to-b from-gray-950 to-dark-green py-24 relative">
        <div className="relative isolate px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl">
            <div
              className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-primary-green to-dark-green opacity-30"
              style={{
                clipPath:
                  'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Ready to transform your financial operations?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Join leading financial institutions in revolutionizing how they handle data and workflows.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/demo"
                className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
        {/* Separator line positioned in the middle of the gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
      </div>
    </div>
  );
}
