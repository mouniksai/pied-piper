"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useFormStore from "../../store/useFormStore";
import useAuthStore from "../../store/useAuthStore";
import TopGraphic from "../../../components/TopGraphic";
import StepHeader from "../../../components/StepHeader";
import Step1 from "../../../components/steps/Step1";
import Step2Login from "../../../components/steps/Step2Login";
import Step2Signup from "../../../components/steps/Step2Signup";
import Step3Confirm from "../../../components/steps/Step3Confirm";

export default function LoginPage() {
  const { currentStep, flowType, setStep } = useFormStore();
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  if (isCheckingAuth) {
     return null; // Or a loading spinner
  }

  if (isAuthenticated) {
     return null; // Will redirect
  }

  return (
    <div className="h-screen w-full bg-app-bg relative">
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-[35vh] min-h-62.5 shrink-0 flex items-end p-4 relative">
            <StepHeader 
              currentStep={currentStep} 
              flowType={flowType} 
              setStep={setStep} 
            />

            <TopGraphic />
        </div>
        
        <div className="stepcont w-full flex-1 bg-[#F0F0F2] flex flex-col items-center pt-12 pb-12">
          <motion.div
            key={`content-${currentStep}-${flowType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-6 text-center"
          >
             {currentStep === 1 && <Step1 />}
             
             {currentStep === 2 && flowType === 'login' && <Step2Login />}
             {currentStep === 2 && flowType !== 'login' && <Step2Signup />}

             {currentStep === 3 && <Step3Confirm />}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
