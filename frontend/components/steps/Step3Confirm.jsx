import React from "react";
import useFormStore from "../../src/store/useFormStore";

const Step3Confirm = () => {
    const { setStep } = useFormStore();

    return (
        <div className="w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're almost there</h2>
            <p className="text-gray-500 mb-8">Review your information and complete the setup.</p>

            <div className="text-gray-600">
                <p>Confirmation logic goes here.</p>
                <button onClick={() => setStep(1)} className="mt-4 underline cursor-pointer">Reset</button>
            </div>
        </div>
    );
};

export default Step3Confirm;
