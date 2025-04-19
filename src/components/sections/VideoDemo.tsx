import React from 'react';

export default function VideoDemo() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">See It In Action</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Product Demo
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Watch how our platform streamlines financial data operations and automates repetitive workflows.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl aspect-video rounded-xl overflow-hidden shadow-xl">
          <iframe 
            src="https://www.loom.com/embed/c30bb15d131145bebfd28fc0625f2d64?sid=2c981c98-0d47-4294-8f39-928354c8214f" 
            frameBorder="0" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        
        <div className="mt-10 flex justify-center">
          <a
            href="/demo"
            className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Request a Full Demo
          </a>
        </div>
      </div>
    </div>
  );
} 