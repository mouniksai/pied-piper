import React from "react";
import { motion } from "framer-motion";
import useFormStore from "../../src/store/useFormStore";

const Step1 = () => {
  const { setFlowType, setStep, nextStep } = useFormStore();

  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Let&apos;s get started</h2>
      <p className="text-gray-500 mb-8">Create your secure account to begin using our platform.</p>

      <div className="flex gap-4 w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-white text-gray-900 border cursor-pointer border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          onClick={() => {
            setFlowType('login');
            setStep(2);
          }}
        >
          Log In
        </motion.button>


        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-pointer hover:bg-green-600 transition-all"
          onClick={() => {
            setFlowType('signup');
            nextStep();
          }}
        >
          Sign Up
        </motion.button>
      </div>
    </div>
  );
};

export default Step1;
