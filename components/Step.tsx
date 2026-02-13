
import React from 'react';

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface StepProps {
  question: string;
  subtitle?: string;
  options: Option[];
  selectedId: string | string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}

const Step: React.FC<StepProps> = ({ question, subtitle, options, selectedId, onSelect, multiSelect = false }) => {
  const isSelected = (id: string) => {
    if (multiSelect && Array.isArray(selectedId)) {
      return selectedId.includes(id);
    }
    return selectedId === id;
  };

  return (
    <div className="flex flex-col animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2 leading-tight">
          {question}
        </h2>
        {subtitle && (
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              flex items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left group
              ${isSelected(option.id) 
                ? 'border-schumer-red bg-schumer-red/[0.02] shadow-[0_4px_20px_rgba(188,3,28,0.1)]' 
                : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'}
            `}
          >
            {option.icon && (
              <div className={`
                mr-5 p-3 rounded-xl transition-all duration-300
                ${isSelected(option.id) 
                  ? 'bg-schumer-red text-white' 
                  : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600'}
              `}>
                {option.icon}
              </div>
            )}
            <span className={`text-base font-semibold tracking-tight ${isSelected(option.id) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'}`}>
              {option.label}
            </span>
            {multiSelect && (
              <div className={`ml-auto w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                ${isSelected(option.id) ? 'bg-schumer-red border-schumer-red' : 'border-gray-200'}
              `}>
                {isSelected(option.id) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step;
