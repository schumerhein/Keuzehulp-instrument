
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
        <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-2">
          {question}
        </h2>
        {subtitle && (
          <p className="text-gray-500 font-medium">
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
              flex items-center p-6 rounded-xl border-2 transition-all duration-300 text-left group
              ${isSelected(option.id) 
                ? 'border-schumer-red bg-schumer-red/5 shadow-md' 
                : 'border-white bg-white hover:border-gray-200 hover:shadow-sm'}
            `}
          >
            {option.icon && (
              <div className={`
                mr-4 p-3 rounded-lg transition-colors
                ${isSelected(option.id) ? 'text-schumer-red' : 'text-gray-400 group-hover:text-gray-600'}
              `}>
                {option.icon}
              </div>
            )}
            <span className={`text-lg font-medium ${isSelected(option.id) ? 'text-gray-900' : 'text-gray-700'}`}>
              {option.label}
            </span>
            {multiSelect && (
              <div className={`ml-auto w-6 h-6 rounded border flex items-center justify-center transition-colors
                ${isSelected(option.id) ? 'bg-schumer-red border-schumer-red' : 'border-gray-300'}
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
