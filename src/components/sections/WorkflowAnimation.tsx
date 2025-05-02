'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WorkflowAnimation() {
  // Define workflow steps
  const workflowSteps = [
    { id: 1, name: 'Data Ingestion', description: 'Import data from various sources', icon: '📥' },
    { id: 2, name: 'Data Processing', description: 'Clean and structure financial data', icon: '⚙️' },
    { id: 3, name: 'AI Analysis', description: 'Apply machine learning models', icon: '🧠' },
    { id: 4, name: 'Workflow Automation', description: 'Generate automated workflows', icon: '🔄' },
    { id: 5, name: 'Results & Insights', description: 'Deliver actionable intelligence', icon: '📊' }
  ];

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Streamlined Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Intelligent Workflow
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From raw data to actionable insights, our platform automates the entire financial data lifecycle
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          {/* Simple workflow steps with explicit animation */}
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Step number and arrow */}
                <div className="flex items-center w-full justify-center">
                  {index > 0 && (
                    <div className="hidden md:block h-0.5 w-12 bg-emerald-500 mr-2" />
                  )}
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                    {step.id}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block h-0.5 w-12 bg-emerald-500 ml-2" />
                  )}
                </div>

                {/* Icon */}
                <div className="mt-4 h-16 w-16 rounded-lg bg-emerald-100 flex items-center justify-center text-3xl">
                  {step.icon}
                </div>
                
                {/* Name and description */}
                <h3 className="mt-4 text-base font-semibold text-gray-900">{step.name}</h3>
                <p className="mt-1 text-sm text-gray-500 text-center max-w-[150px]">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Interactive example box */}
          <div className="mt-20 p-8 bg-white rounded-xl shadow-md border border-gray-100">
            <motion.div 
              className="flex items-center justify-center gap-x-4 p-4 bg-emerald-50 rounded-lg overflow-hidden"
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(5, 150, 105, 0)", "0px 0px 20px rgba(5, 150, 105, 0.3)", "0px 0px 0px rgba(5, 150, 105, 0)"],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-center">
                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">📄</span>
                  <span className="text-xs text-gray-500">Raw Data</span>
                </div>

                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-emerald-500 font-bold text-xl"
                >
                  →
                </motion.div>

                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">⚙️</span>
                  <span className="text-xs text-gray-500">Processing</span>
                </div>

                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-emerald-500 font-bold text-xl"
                >
                  →
                </motion.div>

                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">✨</span>
                  <span className="text-xs text-gray-500">Results</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-6 text-center">
              <p className="text-gray-700 font-medium">Our streamlined workflow eliminates repetitive tasks</p>
              <p className="text-gray-500 mt-2">Turning hours of manual work into minutes of automated processing</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-12 text-center">
            <a
              href="/demo"
              className="inline-block rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              See it in action
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 