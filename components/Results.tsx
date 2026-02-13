
import React from 'react';
import { ConfigResult } from '../types';

interface ResultsProps {
  results: ConfigResult | null;
  onReset: () => void;
  isLoading: boolean;
}

const Results: React.FC<ResultsProps> = ({ results, onReset, isLoading }) => {
  // Enhanced loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-schumer-red border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-serif text-gray-800 italic text-center mb-2">
          Uw advies wordt voorbereid...
        </h2>
        <p className="text-gray-400 text-sm">We matchen uw wensen aan onze collectie op schumer.nl</p>
      </div>
    );
  }

  // Final safety check: if everything fails, show a minimal fallback UI instead of nothing
  const displayResults = results || {
    title: "Onze aanbevelingen",
    intro: "Er is een fout opgetreden bij het laden, maar we adviseren u graag een van onze topmodellen:",
    recommendations: [
      {
        model: "Yamaha U1 Silent",
        motivation: "Een van de meest verkochte piano's ter wereld, nu met het geavanceerde Silent systeem.",
        link: "https://www.schumer.nl/product/yamaha-u1-silent/",
        type: "product",
        ctaText: "Bekijk model"
      }
    ]
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{displayResults.title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {displayResults.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {displayResults.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full hover:-translate-y-1">
            <h3 className="text-xl font-serif text-gray-900 mb-3">{rec.model}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
              {rec.motivation}
            </p>
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 px-4 rounded-xl bg-schumer-dark text-white text-sm font-bold hover:bg-black transition-colors"
            >
              {rec.ctaText}
            </a>
          </div>
        ))}
      </div>

      <div className="bg-schumer-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="z-10 max-w-lg">
          <h3 className="text-2xl md:text-3xl font-serif mb-4">Ervaar het zelf</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Een piano moet u horen en voelen. Kom langs in onze showroom voor een vrijblijvende kennismaking met uw favoriete modellen.
          </p>
        </div>
        <div className="z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
          <a 
            href="https://www.schumer.nl/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-schumer-red hover:bg-schumer-red/90 text-white font-bold rounded-xl transition-all transform hover:scale-105 text-center text-sm"
          >
            Plan showroomafspraak
          </a>
          <a 
            href="mailto:info@schumer.nl"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/20 transition-all text-center text-sm"
          >
            Vraag advies per mail
          </a>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-schumer-red/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-schumer-red font-bold flex items-center justify-center mx-auto gap-2 text-xs uppercase tracking-widest transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Opnieuw beginnen
        </button>
      </div>
    </div>
  );
};

export default Results;
