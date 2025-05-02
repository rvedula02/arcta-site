'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AdvancedWorkflowAnimation() {
  // Reference for the section
  const sectionRef = React.useRef(null);

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Define workflow steps
  const workflowSteps = [
    { id: 1, name: 'Data Ingestion', description: 'Import data from various sources', icon: '📥' },
    { id: 2, name: 'Processing', description: 'Clean and structure data', icon: '⚙️' },
    { id: 3, name: 'Analysis', description: 'Apply AI models', icon: '🧠' },
    { id: 4, name: 'Automation', description: 'Generate workflows', icon: '🔄' },
    { id: 5, name: 'Insights', description: 'Deliver intelligence', icon: '📊' }
  ];

  // Animation for the connecting line
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <div ref={sectionRef} className="bg-gray-50 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Streamlined Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Intelligent Workflow
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From raw data to actionable insights, our platform automates the entire financial data lifecycle
          </p>
        </motion.div>

        <div className="mx-auto mt-24 max-w-5xl">
          {/* Workflow visualization */}
          <div className="relative flex flex-col items-center">
            {/* Vertical timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-200 transform -translate-x-1/2"></div>
            
            {/* Animated progress line */}
            <motion.div 
              className="absolute top-0 left-1/2 w-1 bg-emerald-500 transform -translate-x-1/2"
              style={{ 
                height: lineWidth,
                top: 0
              }}
            />

            {/* Steps */}
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative flex items-center mb-24 last:mb-0 w-full"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Timeline node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl border-4 border-emerald-500"
                    whileInView={{ 
                      scale: [1, 1.2, 1], 
                      backgroundColor: ["#ffffff", "#d1fae5", "#ffffff"] 
                    }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Content box - alternating sides */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'mr-auto pr-8 text-right' : 'ml-auto pl-8'}`}>
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                    whileInView={{ 
                      boxShadow: ["0px 4px 12px rgba(0, 0, 0, 0.05)", "0px 10px 24px rgba(5, 150, 105, 0.15)", "0px 4px 12px rgba(0, 0, 0, 0.05)"] 
                    }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Step {step.id}</span>
                      <h3 className="mt-1 text-lg font-bold text-gray-900">{step.name}</h3>
                      <p className="mt-2 text-gray-600">{step.description}</p>
                      
                      {/* Step-specific illustration */}
                      <div className="mt-4 h-20 bg-gray-50 rounded-md flex items-center justify-center">
                        <motion.div
                          className="text-4xl"
                          animate={{ 
                            rotateY: index % 2 === 0 ? [0, 360] : [0, -360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            repeatType: "loop",
                            repeatDelay: 1
                          }}
                        >
                          {step.icon}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            
            {/* Final result node */}
            <motion.div
              className="relative mt-8 w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl shadow-lg border border-emerald-100 text-center">
                <motion.div 
                  className="inline-flex mx-auto text-5xl mb-4"
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                >
                  ✨
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900">Intelligence, Delivered</h3>
                <p className="mt-3 text-gray-600 max-w-lg mx-auto">
                  Our platform transforms hours of manual work into minutes of automated processing,
                  delivering actionable insights for your financial operations.
                </p>
                <motion.div 
                  className="mt-6"
                  whileInView={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <a
                    href="/demo"
                    className="inline-block rounded-md bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500"
                  >
                    See it in action
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 