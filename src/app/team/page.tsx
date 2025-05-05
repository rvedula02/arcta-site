import Image from 'next/image';
import Link from 'next/link';

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Arjun Hegde',
      position: 'COO',
      email: 'ah2362@cornell.edu',
      degree: 'MEng in CS',
      image: '/team/arjun.png',
    },
    {
      name: 'Rahul Vedula',
      position: 'CSO',
      email: 'rv299@cornell.edu',
      degree: 'MEng in CS',
      image: '/team/rahul.png',
    },
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
    }
    {
      name: 'Emily Gelchie',
      position: 'Intern',
      email: 'emg2757@cornell.edu',
      degree: 'MEng in CS',
      image: '/team/IMG_2858.JPG',
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-950 via-dark-green to-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">Our Team</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five engineers who have been building together since we landed on campus,
            meshing together industry & academic experience in product, engineering, and VC.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20 hover:shadow-xl"
            >
              <div className="aspect-square relative overflow-hidden">
                <Image 
                  src={member.image} 
                  alt={member.name}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6 relative">
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
        
        {/* Footer Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Collectively Driven To Improve Financial Workflows Experiences</h2>
          <div className="flex justify-center mt-8">
            <Link 
              href="/demo" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
