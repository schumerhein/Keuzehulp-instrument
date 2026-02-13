
import React from 'react';
import { ConfigResult } from '../types';

interface ResultsProps {
  results: ConfigResult | null;
  onReset: () => void;
  isLoading: boolean;
}

const Results: React.FC<ResultsProps> = ({ results, onReset, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-16 h-16 border-4 border-schumer-red border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-serif text-gray-700 italic text-center">
          Ons assortiment op schumer.nl wordt doorzocht...
        </h2>
        <p className="mt-4 text-gray-500">We matchen uw wensen aan onze actuele voorraad.</p>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-gray-900 mb-4">{results.title}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {results.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {results.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="text-xl font-serif text-gray-900 mb-3">{rec.model}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
              {rec.motivation}
            </p>
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 px-4 rounded-lg bg-schumer-dark text-white font-medium hover:bg-black transition-colors"
            >
              {rec.ctaText}
            </a>
          </div>
        ))}
      </div>

      {results.sources && results.sources.length > 0 && (
        <div className="mb-12 px-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" />
            </svg>
            Geverifieerde bronnen van schumer.nl
          </h4>
          <div className="flex flex-wrap gap-2">
            {results.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-1 rounded-full transition-colors truncate max-w-[200px]"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-schumer-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="z-10 max-w-lg">
          <h3 className="text-2xl md:text-3xl font-serif mb-4">Wilt u de instrumenten zelf ervaren?</h3>
          <p className="text-gray-300">
            Er gaat niets boven het zelf bespelen en horen van een piano. Plan een vrijblijvende showroomafspraak voor persoonlijk advies.
          </p>
        </div>
        <div className="z-10 flex flex-col sm:flex-row gap-4 shrink-0">
          <a 
            href="https://www.schumer.nl/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-schumer-red hover:bg-schumer-red/90 text-white font-bold rounded-lg transition-all transform hover:scale-105 text-center"
          >
            Plan showroomafspraak
          </a>
          <a 
            href="mailto:info@schumer.nl"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all text-center"
          >
            Vraag persoonlijk advies
          </a>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-schumer-red/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-schumer-red font-medium flex items-center justify-center mx-auto gap-2"
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
