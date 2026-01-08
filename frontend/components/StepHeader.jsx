import React from "react";
import { motion } from "framer-motion";

const StepHeader = ({ currentStep, flowType, setStep }) => {
  return (
    <div className="absolute top-8 left-0 w-full flex flex-col items-center z-10 px-4 md:scale-75 origin-top">
      {/* Title Section */}
      <motion.div 
        key={`header-${currentStep}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 text-center"
      >
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Step {currentStep} of 3</span>
          <h3 className="text-xl font-bold text-gray-900 mt-1">
            {currentStep === 1 ? "Account" : 
            currentStep === 2 ? (flowType === 'login' ? "Welcome Back" : "Details") : 
            "Confirm"}
          </h3>
      </motion.div>

      {/* Visual Dots */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <motion.div
              onClick={() => setStep(step)}
              className={`rounded-full cursor-pointer transition-all duration-300 ${
                currentStep >= step
                  ? "bg-black w-3 h-3 ring-4 ring-black/10"
                  : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            {step < 3 && (
              <div className="w-16 h-[2px] bg-gray-300 relative rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-black"
                  initial={{ width: "0%" }}
                  animate={{ width: currentStep > step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepHeader;
