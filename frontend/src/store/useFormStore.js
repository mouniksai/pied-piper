import { create } from 'zustand';

const useFormStore = create((set, get) => ({
  currentStep: 1,
  flowType: 'signup',
  formData: {
    email: '',
    password: '',
    fullName: '',
  },
  errors: {},

  // Actions
  setStep: (step) => set({ currentStep: step, errors: {} }),
  
  setFlowType: (type) => set({ 
    flowType: type, 
    errors: {}, // Clear errors when switching flow
    // Optional: Clear form data relevant to other flow? keeping it simple for now
    formData: { email: '', password: '', fullName: '' } 
  }),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  updateFormData: (field, value) => 
    set((state) => ({ 
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: undefined } // Clear specific error on change
    })),

  resetForm: () => set({ 
    currentStep: 1, 
    formData: { email: '', password: '', fullName: '' },
    errors: {}
  }),

  // Robust Validation Logic
  validateStep: () => {
    const state = get();
    const { formData, flowType, currentStep } = state;
    const newErrors = {};
    let isValid = true;

    // Email Regex: Standard RFC 5322 compliant-ish regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Password: At least 8 chars, 1 letter, 1 number, 1 special char
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (currentStep === 2) {
      // 1. Validate Email (Common for both)
      if (!formData.email) {
        newErrors.email = "Email is required.";
        isValid = false;
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }

      // 2. Validate Password (Common for both)
      if (!formData.password) {
        newErrors.password = "Password is required.";
        isValid = false;
      } else {
        // Different rules for Login vs Signup? 
        // Usually Signup is strict, Login just checks if it's there. 
        // But checking format on login saves an API call if obviously wrong.
        if (flowType === 'signup') {
           if (!passwordRegex.test(formData.password)) {
             newErrors.password = "Password must be 8+ chars, with a letter, number & special char.";
             isValid = false;
           }
        } else {
           // Login validation (less strict, just length)
           if (formData.password.length < 1) {
              newErrors.password = "Password is required.";
              isValid = false;
           }
        }
      }

      // 3. Validate Full Name (Signup Only)
      if (flowType === 'signup') {
        if (!formData.fullName || !formData.fullName.trim()) {
          newErrors.fullName = "Full name is required.";
          isValid = false;
        } else if (formData.fullName.trim().length < 2) {
          newErrors.fullName = "Name must be at least 2 characters.";
          isValid = false;
        }
      }
    }

    set({ errors: newErrors });
    return isValid;
  }
}));

export default useFormStore;