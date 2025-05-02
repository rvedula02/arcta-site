'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AdvancedWorkflowAnimation() {
  // Reference for the section
  const sectionRef = React.useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Define workflow steps
  const workflowSteps = [
    { id: 1, name: 'Data Ingestion', description: 'AI-powered system that automatically imports and categorizes your financial data from any source', icon: '📥' },
    { id: 2, name: 'Processing', description: 'Advanced algorithms clean, structure, and normalize your data for analysis', icon: '⚙️' },
    { id: 3, name: 'Analysis', description: 'Machine learning models uncover patterns and insights humans might miss', icon: '🧠' },
    { id: 4, name: 'Automation', description: 'Generate personalized workflows that adapt to your specific financial operations', icon: '🔄' },
    { id: 5, name: 'Insights', description: 'Deliver actionable intelligence to transform your decision-making process', icon: '📊' }
  ];

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Animation for the connecting line
  const lineProgress = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);
  
  // Use scrollYProgress to determine which step is active
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      const stepCount = workflowSteps.length;
      const stepSegment = 0.9 / stepCount;
      
      if (value < 0.1) {
        setActiveStep(0);
      } else if (value >= 0.9) {
        setActiveStep(stepCount + 1);
      } else {
        const normalizedProgress = value / 0.9;
        const currentStep = Math.ceil(normalizedProgress * stepCount);
        setActiveStep(currentStep);
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, workflowSteps.length]);

  return (
    <div ref={sectionRef} className="bg-gray-50 py-20">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Streamlined Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Intelligent Workflow
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Watch how our platform transforms raw financial data into actionable insights
          </p>
        </div>
      </div>

      {/* Fixed timeline header */}
      <div className="sticky top-0 bg-gray-50 py-6 border-t border-b border-gray-200 z-50 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {/* Add the header text */}
          <div className="text-center mb-6">
            <h3 className="text-base font-semibold leading-7 text-emerald-600">Streamlined Process</h3>
            <p className="text-2xl font-bold tracking-tight text-gray-900">
              Our Intelligent Workflow
            </p>
          </div>
          
          <div className="relative">
            {/* Horizontal timeline line */}
            <div className="h-1 bg-gray-200 rounded-full"></div>
            
            {/* Animated progress line */}
            <motion.div 
              className="absolute top-0 left-0 h-1 bg-emerald-500 origin-left rounded-full"
              style={{ width: lineProgress }}
            />

            {/* Step markers */}
            <div className="flex justify-between mt-4">
              {workflowSteps.map((step, index) => {
                const isActive = activeStep >= step.id;
                const isCurrent = activeStep === step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    {/* Step circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-4 ${
                      isActive 
                        ? 'bg-emerald-500 text-white border-emerald-600' 
                        : 'bg-white text-gray-400 border-gray-300'
                    } transition-colors duration-300`}>
                      {step.id}
                    </div>
                    
                    {/* Step name */}
                    <p className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-emerald-700' : 'text-gray-500'
                    } text-center transition-colors duration-300`}>
                      {step.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step contents - staggered cards */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 mt-12">
        {workflowSteps.map((step, index) => {
          const isVisible = activeStep >= step.id;
          const isActive = activeStep === step.id;
          const isLeft = index % 2 === 0;

          return (
            <div 
              key={step.id}
              className={`mb-20 ${isLeft ? 'mr-auto ml-0' : 'ml-auto mr-0'} relative w-full md:w-4/5`}
            >
              <motion.div
                className={`border rounded-lg shadow-md p-6 bg-white ${
                  isActive ? 'border-emerald-300' : 'border-gray-100'
                }`}
                initial={{ opacity: 0, y: 50, x: isLeft ? -20 : 20 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 50,
                  x: isVisible ? 0 : (isLeft ? -20 : 20),
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Step indicator */}
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {step.id}
                  </div>
                  <div>
                    <span className={`text-xs uppercase tracking-wider font-bold ${
                      isActive ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      Step {step.id}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{step.name}</h3>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isActive ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {/* Progress indicator for active step */}
                {isActive && (
                  <motion.div 
                    className="w-full h-1 bg-emerald-100 mt-4 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div 
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Final result - only shows after all steps are complete */}
      {activeStep > workflowSteps.length && (
        <motion.div
          className="mt-12 mx-auto max-w-2xl px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl shadow-lg border border-emerald-100 text-center">
            <div className="text-6xl mb-6">✨</div>
            
            <h3 className="text-3xl font-bold text-gray-900">
              Intelligence, Delivered
            </h3>
            
            <p className="mt-4 text-gray-600 max-w-lg mx-auto text-lg">
              Our platform transforms hours of manual work into minutes of automated processing,
              delivering actionable insights for your financial operations.
            </p>
            
            <div className="mt-8">
              <a
                href="/demo"
                className="inline-block rounded-md bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                See it in action
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 