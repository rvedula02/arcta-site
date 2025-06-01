'use client';

import ArctaLogo from '../ArctaLogo';
import Image from 'next/image';

const navigation = {
  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/arcta-ai',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      href: 'https://x.com/arcta_ai',
      icon: () => (
        <Image 
          src="/x_logo.png" 
          alt="X Logo" 
          width={32} 
          height={32} 
          className="h-8 w-8 object-contain"
        />
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-green relative z-40" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <ArctaLogo imageSize={60} />
            <div className="flex items-center space-x-2 relative z-50">
              {navigation.social.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800/30 flex items-center justify-center cursor-pointer relative z-50"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-8 w-8" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <p className="text-sm leading-6 text-gray-300">
            Transforming the way financial offices work.
          </p>
          
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">&copy; {new Date().getFullYear()} Arcta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 