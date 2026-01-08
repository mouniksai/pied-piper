import React from "react";
import { motion } from "framer-motion";
import Input from "../Input";
import GoogleIcon from "../GoogleIcon";
import useFormStore from "../../src/store/useFormStore";

const Step2Login = () => {
  const { formData, updateFormData, setStep, errors, validateStep } = useFormStore();

  const handleChange = (e) => {
    updateFormData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
       // Proceed to login
    }
  };

  return (
    <div className="w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Login to your account</h2>
        <p className="text-gray-500">Enter your credentials to access your account.</p>
      </div>

      <button 
        type="button"
        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-2.5 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 mb-4 cursor-pointer"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <div className="relative flex py-1 items-center mb-4">
        <div className="grow border-t border-gray-200"></div>
        <span className="shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      <Input 
        label="Email Address" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        error={errors.email}
      />
      <Input 
        label="Password" 
        name="password" 
        isPassword 
        value={formData.password} 
        onChange={handleChange} 
        error={errors.password}
      />

      <motion.button
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
         className="w-full py-3 bg-black text-white rounded-xl font-bold mt-4 cursor-pointer shadow-lg shadow-black/20"
         onClick={handleSubmit}
      >
        Log In
      </motion.button>
      
      <p className="mt-3 text-sm text-gray-500 text-center cursor-pointer hover:underline" onClick={() => setStep(1)}>
        Back to options
      </p>
    </div>
  );
};

export default Step2Login;
