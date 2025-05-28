import Image from 'next/image';
import Link from 'next/link';

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Tarun Venkatasamy',
      position: 'CEO',
      email: 'tv89@cornell.edu',
      degree: 'MEng in ECE',
      image: '/team/tarun.png',
    },
    {
      name: 'Arnav Kolli',
      position: 'CTO',
      email: 'ak2677@cornell.edu',
      degree: 'MEng in CS',
      image: '/team/arnie.png',
    },
    {
      name: 'Rahul Vedula',
      position: 'CSO',
      email: 'rv299@cornell.edu',
      degree: 'MEng in CS',
      image: '/team/rahul.png',
    }
  ];

  return (
    <div className="text-gray-300 relative">
      <div className="bg-gradient-to-b from-gray-950 via-dark-green to-gray-950 min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">Our Team</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three engineers who have been building together since we landed on campus,
              meshing together industry & academic experience in product, engineering, and VC.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="relative group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
                style={{ backgroundColor: '#043435' }}
              >
                <div className="flex justify-center pt-4">
                  <div className="w-[70%] aspect-square relative overflow-hidden rounded-t-lg">
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <div className="p-6 relative text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-emerald-400 font-semibold mb-3">{member.position}</p>
                  
                  <div className="text-gray-300 space-y-1 text-sm">
                    <p>{member.degree}</p>
                    <Link 
                      href={`mailto:${member.email}`} 
                      className="text-gray-400 hover:text-emerald-300 transition-colors"
                    >
                      {member.email}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section with seamless transition to footer - matching home page exactly */}
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
              Collectively Driven To Improve Financial Workflows Experiences
            </h2>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/demo"
                className="rounded-md border border-white/20 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all"
                style={{ backgroundColor: '#043435' }}
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
        {/* Separator line positioned in the middle of the gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
      </div>
    </div>
  );
} 
