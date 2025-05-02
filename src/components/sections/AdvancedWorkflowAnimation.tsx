'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function AdvancedWorkflowAnimation() {
  // Reference for the section
  const sectionRef = React.useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Define workflow steps
  const workflowSteps = [
    { id: 1, name: 'Data Ingestion', description: 'AI-powered system that automatically imports and categorizes your financial data from any source', icon: '📥' },
    { id: 2, name: 'Processing', description: 'Advanced algorithms clean, structure, and normalize your data for analysis', icon: '⚙️' },
    { id: 3, name: 'Analysis', description: 'Machine learning models uncover patterns and insights humans might miss', icon: '🧠' },
    { id: 4, name: 'Automation', description: 'Generate personalized workflows that adapt to your specific financial operations', icon: '🔄' },
    { id: 5, name: 'Insights', description: 'Deliver actionable intelligence to transform your decision-making process', icon: '📊' }
  ];

  // Animation for the connecting line
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);
  
  // Use scrollYProgress to determine which step is active
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Map scroll progress to steps
      const stepCount = workflowSteps.length;
      const stepSegment = 0.6 / stepCount; // Use 60% of the scroll range for steps
      
      if (value < 0.1) {
        setActiveStep(0); // Before any step
        setRevealedSteps([]);
      } else if (value >= 0.7) {
        setActiveStep(stepCount + 1); // Final result
        setRevealedSteps(workflowSteps.map(step => step.id));
      } else {
        // Calculate which step we're on based on scroll position
        const normalizedProgress = (value - 0.1) / 0.6; // Normalize to 0-1 within our step range
        const currentStep = Math.floor(normalizedProgress * stepCount) + 1;
        setActiveStep(currentStep);
        
        // Update revealed steps
        const newRevealedSteps = [];
        for (let i = 1; i <= currentStep; i++) {
          newRevealedSteps.push(i);
        }
        setRevealedSteps(newRevealedSteps);
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, workflowSteps.length]);

  // Data "particles" following the timeline
  const particleElements = Array.from({ length: 10 }).map((_, i) => {
    // Calculate delay based on index for staggered effect
    const delay = i * 0.8;
    
    return (
      <motion.div
        key={i}
        className="absolute top-1/2 h-2 w-2 rounded-full bg-emerald-400 transform -translate-y-1/2"
        initial={{ left: "-10px", opacity: 0 }}
        animate={{ 
          left: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 8,
          delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: '0 0 10px rgba(5, 150, 105, 0.5)'
        }}
      />
    );
  });

  return (
    <div ref={sectionRef} className="bg-gray-50 py-24 sm:py-32">
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
            Watch how our platform transforms raw financial data into actionable insights
          </p>
        </motion.div>

        {/* Main Timeline Section */}
        <div className="mx-auto mt-24 max-w-6xl relative">
          {/* Horizontal timeline line */}
          <div className="sticky top-20 h-1 bg-gray-200 rounded-full z-10"></div>
          
          {/* Animated progress line */}
          <motion.div 
            className="sticky top-20 h-1 bg-emerald-500 origin-left rounded-full z-20"
            style={{ width: lineProgress }}
          />

          {/* Moving particles */}
          <div className="sticky top-20 h-1 overflow-hidden z-30">
            {activeStep > 0 && particleElements}
          </div>

          {/* Steps on the timeline */}
          <div className="sticky top-4 pt-4 flex justify-between z-40">
            {workflowSteps.map((step, index) => {
              const isActive = activeStep > index;
              const isNext = activeStep === index;
              
              return (
                <div key={step.id} className="relative" style={{ width: '20%' }}>
                  {/* Timeline node */}
                  <motion.div 
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xl border-4 transition-colors duration-300 ${
                      isActive ? 'bg-emerald-500 text-white border-emerald-600' : 
                      isNext ? 'bg-white border-emerald-500 text-emerald-500' : 
                      'bg-white border-gray-300 text-gray-400'
                    }`}
                    animate={isNext ? { 
                      scale: [1, 1.2, 1],
                      boxShadow: ['0px 0px 0px rgba(5, 150, 105, 0)', '0px 0px 20px rgba(5, 150, 105, 0.5)', '0px 0px 0px rgba(5, 150, 105, 0)']
                    } : {}}
                    transition={{ duration: 1.5, repeat: isNext ? Infinity : 0 }}
                  >
                    <span className="text-sm">{step.id}</span>
                  </motion.div>

                  {/* Step label */}
                  <div className="mt-2 text-center">
                    <motion.p 
                      className={`text-sm font-semibold ${isActive ? 'text-emerald-700' : isNext ? 'text-emerald-600' : 'text-gray-500'}`}
                      animate={{ opacity: isActive || isNext ? 1 : 0.7 }}
                    >
                      {step.name}
                    </motion.p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step details cards - staggered layout */}
          <div className="mt-24">
            {workflowSteps.map((step, index) => {
              const isRevealed = revealedSteps.includes(step.id);
              const isActive = activeStep === step.id;
              const isComplete = activeStep > step.id;
              
              return (
                <motion.div
                  key={step.id}
                  className={`mb-16 ${index % 2 === 0 ? 'ml-0 mr-auto' : 'ml-auto mr-0'} w-4/5 md:w-3/5`}
                  initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ 
                    opacity: isRevealed ? 1 : 0,
                    y: isRevealed ? 0 : 50,
                    x: isRevealed ? 0 : (index % 2 === 0 ? -20 : 20)
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100,
                    damping: 20
                  }}
                >
                  <motion.div
                    className={`bg-white p-6 rounded-lg shadow-md border ${
                      isActive ? 'border-emerald-300' : 
                      isComplete ? 'border-emerald-200' : 
                      'border-gray-100'
                    }`}
                    animate={{ 
                      boxShadow: isActive ? 
                        ['0px 4px 12px rgba(0, 0, 0, 0.05)', '0px 10px 24px rgba(5, 150, 105, 0.15)', '0px 4px 12px rgba(0, 0, 0, 0.05)'] : 
                        '0px 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <motion.div
                          className={`w-12 h-12 rounded-lg ${
                            isActive ? 'bg-emerald-100' : 
                            isComplete ? 'bg-emerald-50' : 
                            'bg-gray-100'
                          } flex items-center justify-center text-2xl`}
                          animate={{ 
                            rotate: isActive ? [0, 10, 0, -10, 0] : 0,
                            scale: isActive ? [1, 1.1, 1] : 1
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: isActive ? Infinity : 0,
                            repeatType: "loop" 
                          }}
                        >
                          {step.icon}
                        </motion.div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${
                          isActive ? 'text-emerald-600' : 
                          isComplete ? 'text-emerald-500' : 
                          'text-gray-500'
                        }`}>
                          Step {step.id}
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-gray-900">{step.name}</h3>
                        <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    
                    {/* Animation indicator */}
                    {isActive && (
                      <motion.div 
                        className="w-full h-1 bg-emerald-100 mt-4 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div 
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Final result node */}
          {activeStep > workflowSteps.length && (
            <motion.div
              className="mt-20 mx-auto max-w-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 100, 
                damping: 20 
              }}
            >
              <motion.div 
                className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl shadow-lg border border-emerald-100 text-center"
                animate={{ 
                  boxShadow: [
                    "0px 10px 30px rgba(5, 150, 105, 0.1)",
                    "0px 20px 50px rgba(5, 150, 105, 0.2)",
                    "0px 10px 30px rgba(5, 150, 105, 0.1)"
                  ]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <motion.div 
                  className="inline-flex mx-auto text-6xl mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.3 
                  }}
                >
                  ✨
                </motion.div>
                
                <motion.h3 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Intelligence, Delivered
                </motion.h3>
                
                <motion.p 
                  className="mt-4 text-gray-600 max-w-lg mx-auto text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Our platform transforms hours of manual work into minutes of automated processing,
                  delivering actionable insights for your financial operations.
                </motion.p>
                
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <a
                    href="/demo"
                    className="inline-block rounded-md bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors"
                  >
                    See it in action
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 