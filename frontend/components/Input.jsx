"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ label, isPassword, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full mb-4 group">
      {/* Floating Label Animation */}
      <motion.label
        initial={false}
        animate={{
          y: isFocused || props.value ? -24 : 0,
          scale: isFocused || props.value ? 0.85 : 1,
          color: error ? "#EF4444" : (isFocused ? "#0A0A0A" : "#9CA3AF"), // Red if error, Black on focus
        }}
        className="absolute left-0 top-3 text-gray-400 pointer-events-none origin-left transition-colors"
      >
        {label}
      </motion.label>
      
      {/* Input Field */}
      <input
        {...props}
        type={isPassword && !showPassword ? "password" : "text"}
        onFocus={(e) => {
            setIsFocused(true);
            if(props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
            setIsFocused(false);
            if(props.onBlur) props.onBlur(e);
        }}
        className={`w-full bg-transparent border-b py-3 text-gray-900 outline-none transition-colors duration-300 placeholder-transparent
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
      />

      {/* Password Toggle Icon */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-3 text-gray-400 hover:text-black transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="absolute text-red-500 text-xs bottom-[-20px] left-0 mt-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default Input;